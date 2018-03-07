#import "RHNativeFeed.h"
#import <React/RCTAssert.h>
#import <React/RCTRefreshControl.h>
#import <React/UIView+React.h>
#import "RHNativeFeedHeader.h"
#import "RHNativeFeedItem.h"
#import "RHCustomScrollView.h"
#import "RHScrollEvent.h"
#import <SDWebImage/SDWebImageDownloader.h>

@implementation RHNativeFeed
{
  RCTEventDispatcher *_eventDispatcher;
  NSArray* visibleCells;
  NSArray* visibleViews;
  
  RHCustomScrollView* _scrollView;
  
  CGFloat _cellHeight;
  CGFloat _cellSeparatorHeight;
  NSInteger _numCells;
  
  UIView* _cellBackingView;

  NSHashTable *_scrollListeners;
  uint16_t _coalescingKey;
  NSString *_lastEmittedEventName;
  NSTimeInterval _lastScrollDispatchTime;
  NSMutableArray<NSValue *> *_cachedChildFrames;
  BOOL _allowNextScrollNoMatterWhat;

  id loadImagesContext;
  NSInteger numPendingChecks;
  NSArray* _storyImages;
  NSSet* loadedStoryImages;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  RCTAssertParam(eventDispatcher);
  
  if ((self = [super initWithFrame:CGRectZero])) {
    _eventDispatcher = eventDispatcher;

    loadedStoryImages = [NSSet set];

    _scrollView = [[RHCustomScrollView alloc] initWithFrame:CGRectZero];
    _scrollView.translatesAutoresizingMaskIntoConstraints = NO;
    _scrollView.delegate = self;
    _scrollView.delaysContentTouches = NO;
    _scrollView.canCancelContentTouches = YES;
    
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 110000 /* __IPHONE_11_0 */
    // `contentInsetAdjustmentBehavior` is only available since iOS 11.
    // We set the default behavior to "never" so that iOS
    // doesn't do weird things to UIScrollView insets automatically
    // and keeps it as an opt-in behavior.
    if ([_scrollView respondsToSelector:@selector(setContentInsetAdjustmentBehavior:)]) {
      _scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }
#endif
//
//    _automaticallyAdjustContentInsets = YES;
//    _contentInset = UIEdgeInsetsZero;
//    _contentSize = CGSizeZero;
//    _lastClippedToRect = CGRectNull;

    _DEPRECATED_sendUpdatedChildFrames = NO;

    _scrollEventThrottle = 0.0;
    _lastScrollDispatchTime = 0;
    _cachedChildFrames = [NSMutableArray new];

    _scrollListeners = [NSHashTable weakObjectsHashTable];

    [self addSubview:_scrollView];
    
    _cellBackingView = [[UIView alloc] initWithFrame:CGRectZero];
    _cellBackingView.userInteractionEnabled = YES;
    _cellBackingView.backgroundColor = [UIColor colorWithWhite:0.929411f alpha:1.f];
    [_scrollView addSubview:_cellBackingView];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_scrollView
                                                     attribute:NSLayoutAttributeTop
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:self
                                                     attribute:NSLayoutAttributeTop
                                                    multiplier:1 constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_scrollView
                                                     attribute:NSLayoutAttributeBottom
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:self
                                                     attribute:NSLayoutAttributeBottom
                                                    multiplier:1 constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_scrollView
                                                     attribute:NSLayoutAttributeLeading
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:self
                                                     attribute:NSLayoutAttributeLeading
                                                    multiplier:1 constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_scrollView
                                                     attribute:NSLayoutAttributeTrailing
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:self
                                                     attribute:NSLayoutAttributeTrailing
                                                    multiplier:1 constant:0]];
    
    [_scrollView
     addObserver:self
     forKeyPath:@"contentOffset"
     options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
  }
  return self;
}

- (NSArray*) storyImages
{
  return _storyImages;
}

- (void) setStoryImages:(NSArray*)inStoryImages
{
  NSMutableArray* mStoryImages = [@[] mutableCopy];
  NSInteger numImagesToCheck = 0;
  
  for (NSString* storyImage in inStoryImages)
  {
    if ([storyImage isKindOfClass:[NSString class]])
    {
      NSURL* storyImageUrl = [NSURL URLWithString:storyImage];
      if (storyImageUrl)
      {
        numImagesToCheck++;
        [mStoryImages addObject:storyImageUrl];
      }
      else
      {
        [mStoryImages addObject:[NSNull null]];
      }
    }
    else if ([storyImage isKindOfClass:[NSURL class]])
    {
      numImagesToCheck++;
      [mStoryImages addObject:storyImage];
    }
    else
    {
      [mStoryImages addObject:[NSNull null]];
    }
  }
  
  _storyImages = [NSArray arrayWithArray:mStoryImages];

  loadedStoryImages = [NSSet set];
  id currentLoadImagesContext = [[NSObject alloc] init];
  loadImagesContext = currentLoadImagesContext;
  numPendingChecks = numImagesToCheck;

  __weak RHNativeFeed* weakFeed = self;
  for (NSURL* storyImage in _storyImages)
  {
    if (![storyImage isKindOfClass:[NSURL class]])
    {
      continue;
    }

    [[SDWebImageManager sharedManager] cachedImageExistsForURL:storyImage completion:^(BOOL isInCache){
      RHNativeFeed* strongSelf = weakFeed;
      [strongSelf imageUrl:storyImage wasLoaded:isInCache context:currentLoadImagesContext];
    }];
  }
  
  [self recalculateVisibleCells];
}

- (void) imageUrl:(NSURL*)url wasLoaded:(BOOL)loaded context:(id)context
{
  if (context != loadImagesContext)
  {
    return;
  }

  if (loaded)
  {
    NSMutableSet* mLoadedStoryImages = [loadedStoryImages mutableCopy];
    [mLoadedStoryImages addObject:url];
    loadedStoryImages = [NSSet setWithSet:mLoadedStoryImages];
  }
  
  numPendingChecks--;
  
  if (numPendingChecks <= 0)
  {
    NSMutableArray* mUrlsToFetch = [@[] mutableCopy];
    
    for (NSURL* storyImage in _storyImages)
    {
      if ([storyImage isKindOfClass:[NSURL class]] && ![loadedStoryImages containsObject:storyImage])
      {
        [mUrlsToFetch addObject:storyImage];
      }
    }
    
    SDWebImagePrefetcher* prefetcher = [SDWebImagePrefetcher sharedImagePrefetcher];
    
    prefetcher.delegate = self;
    [prefetcher prefetchURLs:mUrlsToFetch];
  }

  [self recalculateVisibleCells];
}

- (void)imagePrefetcher:(nonnull SDWebImagePrefetcher *)imagePrefetcher didPrefetchURL:(nullable NSURL *)imageURL finishedCount:(NSUInteger)finishedCount totalCount:(NSUInteger)totalCount
{
  NSMutableSet* mLoadedStoryImages = [loadedStoryImages mutableCopy];
  [mLoadedStoryImages addObject:imageURL];
  loadedStoryImages = [NSSet setWithSet:mLoadedStoryImages];

  [self recalculateBackingView];
}

- (void) observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context
{
  if ([keyPath isEqualToString:@"contentOffset"])
  {
    [self recalculateVisibleCells];
    
    CGFloat totalNonStickyHeaderHeights = 0.f;
    for (UIView* subview in self.subviews)
    {
      if ([subview isKindOfClass:[RHNativeFeedHeader class]])
      {
        RHNativeFeedHeader* header = (RHNativeFeedHeader*) subview;
        if (header.sticky)
        {
          header.transform = CGAffineTransformIdentity;
          CGFloat headerOffset = MIN(_scrollView.contentOffset.y, header.frame.origin.y);
          header.transform = CGAffineTransformMakeTranslation(0.f, -1.f * headerOffset);
        }
        else
        {
          totalNonStickyHeaderHeights += header.frame.size.height;
        }
      }
    }
    
    if (totalNonStickyHeaderHeights > 1.f)
    {
      CGFloat a = _scrollView.contentOffset.y / totalNonStickyHeaderHeights;
      a = MIN(a, 1.f);
      a = MAX(a, 0.f);
      a = 1.f - a;
      
      for (UIView* subview in self.subviews)
      {
        if ([subview isKindOfClass:[RHNativeFeedHeader class]])
        {
          RHNativeFeedHeader* header = (RHNativeFeedHeader*) subview;
          if (!header.sticky)
          {
            header.alpha = a;
          }
        }
      }
    }
  }
  else
  {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void) dealloc
{
  [_scrollView
   removeObserver:self
   forKeyPath:@"contentOffset"];
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithFrame:(CGRect)frame)
RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex
{
  [super insertReactSubview:view atIndex:atIndex];
  [self recalculateBackingView];
}

- (void)layoutSubviews
{
  [super layoutSubviews];

  for (RCTRefreshControl* refreshControl in _scrollView.subviews)
  {
    if (![refreshControl isKindOfClass:[RCTRefreshControl class]])
    {
      continue;
    }
    
    if (refreshControl && refreshControl.refreshing) {
      refreshControl.frame = (CGRect){_scrollView.contentOffset, {_scrollView.frame.size.width, refreshControl.frame.size.height}};
    }
  }

  [self updateClippedSubviews];
}

- (void) addSubview:(UIView *)view
{
  if ([view isKindOfClass:[UIScrollView class]])
  {
    [super addSubview:view];
  }
  else if ([view isKindOfClass:[RHNativeFeedHeader class]])
  {
    if (((RHNativeFeedHeader*)view).sticky)
    {
      [super insertSubview:view aboveSubview:_scrollView];
    }
    else
    {
      [super insertSubview:view belowSubview:_scrollView];
    }
  }
  else
  {
    [_scrollView addSubview:view];
  }
  [self recalculateBackingView];
}

- (void) recalculateBackingView
{
  CGFloat minY = CGFLOAT_MAX;
  CGFloat maxY = CGFLOAT_MIN;
  for (UIView* view in _scrollView.subviews)
  {
    if ([view isKindOfClass:[RHNativeFeedItem class]])
    {
      if (view.frame.origin.y < minY)
      {
        minY = view.frame.origin.y;
      }
      
      CGFloat topY = view.frame.origin.y + view.frame.size.height;
      if (topY > maxY)
      {
        maxY = topY;
      }
    }
  }
  
  if (maxY > minY)
  {
    _cellBackingView.frame = CGRectMake(0, minY, self.bounds.size.width, maxY-minY);
  }
  else
  {
    _cellBackingView.frame = CGRectZero;
  }
}

- (void) setFrame:(CGRect)frame
{
  [super setFrame:frame];
  [self recalculateBackingView];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesEnded:touches withEvent:event];
}


- (void)removeReactSubview:(UIView *)subview
{
  [super removeReactSubview:subview];
  [self recalculateBackingView];
}

- (void) setCellHeight:(CGFloat)cellHeight
{
  _cellHeight = cellHeight;
  [self setContentSize];
  [self recalculateVisibleCells];
}

- (CGFloat) cellHeight
{
  return _cellHeight;
}

- (void) setCellSeparatorHeight:(CGFloat)cellSeparatorHeight
{
  _cellSeparatorHeight = cellSeparatorHeight;
  [self setContentSize];
  [self recalculateVisibleCells];
}

- (CGFloat) cellSeparatorHeight
{
  return _cellSeparatorHeight;
}

- (void) setNumCells:(NSInteger)numCells
{
  _numCells = numCells;
  [self setContentSize];
  [self recalculateVisibleCells];
}

- (NSInteger) numCells
{
  return _numCells;
}

- (CGFloat) getTotalHeaderSize
{
  CGFloat totalHeaderSize = 0.f;

  for (UIView* view in self.subviews)
  {
    if ([view isKindOfClass:[RHNativeFeedHeader class]])
    {
      totalHeaderSize += view.frame.size.height;
    }
  }
  
  return totalHeaderSize;
}

- (void) setContentSize
{
  _scrollView.contentSize = CGSizeMake([UIScreen mainScreen].bounds.size.width, [self getTotalHeaderSize] + (_numCells*(_cellHeight+_cellSeparatorHeight)));
}

- (void) setBounds:(CGRect)bounds
{
  [super setBounds:bounds];
  [self recalculateVisibleCells];
}

//@property(nonatomic, assign) NSInteger minCellIndex;
//@property(nonatomic, assign) NSInteger maxCellIndex;

- (void) recalculateVisibleCells
{
  [self recalculateVisibleCells:_scrollView.contentOffset];
}

- (void) recalculateVisibleCells:(CGPoint)contentOffset
{
  NSInteger minCell = NSIntegerMax;
  NSInteger maxCell = NSIntegerMin;
  NSInteger playingCell = 0;

  if (!_onVisibleCellsChanged)
  {
    minCell = -2;
    maxCell = -2;
    playingCell = -2;
  }
  else if (_numCells <= 0)
  {
    minCell = -1;
    maxCell = -1;
    playingCell = -1;
  }
  else
  {
    CGRect visibleBounds = self.bounds;
    visibleBounds.origin = contentOffset;

    CGFloat fullCellHeight = _cellHeight + _cellSeparatorHeight;
    CGFloat totalHeaderSize = [self getTotalHeaderSize];
    
    CGFloat maxIntersectionSize = 0;
    for (int i = 0; i < _numCells; i++)
    {
      CGRect cellFrame = CGRectMake(0, totalHeaderSize+(i*fullCellHeight), visibleBounds.size.width, fullCellHeight);
      CGRect cellIntersection = CGRectIntersection(visibleBounds, cellFrame);
      
      CGFloat intersectionSize = cellIntersection.size.width * cellIntersection.size.height;
      if (intersectionSize > maxIntersectionSize)
      {
        maxIntersectionSize = intersectionSize;
        playingCell = i;
      }
      
      if (cellIntersection.size.height > 0.5f && cellIntersection.size.width > 0.5f)
      {
        if (i < minCell)
        {
          minCell = i;
        }
        
        if (i > maxCell)
        {
          maxCell = i;
        }
      }
    }
    
    minCell = MAX(minCell-_numPreloadAheadCells, 0);
    maxCell = MIN(maxCell+1+_numPreloadAheadCells, _numCells);
  }

  /*
   id loadImagesContext;
   NSArray* _storyImages;
   NSSet* loadedStoryImages;
   */
  
  NSInteger i = 0;
  for (NSURL* storyImage in _storyImages)
  {
    if ([loadedStoryImages containsObject:storyImage])
    {
      i++;
    }
    else if (storyImage == [NSNull null])
    {
      i++;
    }
    else
    {
      break;
    }
  }
  
  maxCell = MIN(maxCell, i);

  if (minCell != self.minCellIndex || maxCell != self.maxCellIndex || playingCell != self.playingCellIndex)
  {
    self.minCellIndex = minCell;
    self.maxCellIndex = maxCell;
    self.playingCellIndex = playingCell;
    if (_onVisibleCellsChanged)
    {
      if (minCell < 0 || maxCell < 0 || playingCell < 0)
      {
        _onVisibleCellsChanged(@{});
      }
      else
      {
        _onVisibleCellsChanged(@{
                                 @"visibleCells": @{
                                     @"minCell": @(minCell),
                                     @"maxCell": @(maxCell),
                                     },
                                 @"playingCell": @(playingCell),
                                 });
      }
    }
  }
}

- (void)scrollViewDidScrollToTop:(UIScrollView *)scrollView
{
  [self recalculateVisibleCells];
}

- (void)sendScrollEventWithName:(NSString *)eventName
                     scrollView:(UIScrollView *)scrollView
                       userData:(NSDictionary *)userData
{
  if (![_lastEmittedEventName isEqualToString:eventName]) {
    _coalescingKey++;
    _lastEmittedEventName = [eventName copy];
  }
  RHScrollEvent *scrollEvent = [[RHScrollEvent alloc] initWithEventName:eventName
                                                                reactTag:self.reactTag
                                                 scrollViewContentOffset:scrollView.contentOffset
                                                  scrollViewContentInset:scrollView.contentInset
                                                   scrollViewContentSize:scrollView.contentSize
                                                         scrollViewFrame:scrollView.frame
                                                     scrollViewZoomScale:scrollView.zoomScale
                                                                userData:userData
                                                           coalescingKey:_coalescingKey];
  [_eventDispatcher sendEvent:scrollEvent];
}


#pragma mark - ScrollView delegate

#define RCT_SEND_SCROLL_EVENT(_eventName, _userData) { \
NSString *eventName = NSStringFromSelector(@selector(_eventName)); \
[self sendScrollEventWithName:eventName scrollView:_scrollView userData:_userData]; \
}

#define RCT_FORWARD_SCROLL_EVENT(call) \
for (NSObject<UIScrollViewDelegate> *scrollViewListener in _scrollListeners) { \
if ([scrollViewListener respondsToSelector:_cmd]) { \
[scrollViewListener call]; \
} \
}

#define RCT_SCROLL_EVENT_HANDLER(delegateMethod, eventName) \
- (void)delegateMethod:(UIScrollView *)scrollView           \
{                                                           \
RCT_SEND_SCROLL_EVENT(eventName, nil);                    \
RCT_FORWARD_SCROLL_EVENT(delegateMethod:scrollView);      \
}

RCT_SCROLL_EVENT_HANDLER(scrollViewWillBeginDecelerating, onMomentumScrollBegin)
RCT_SCROLL_EVENT_HANDLER(scrollViewDidZoom, onScroll)

- (void)addScrollListener:(NSObject<UIScrollViewDelegate> *)scrollListener
{
  [_scrollListeners addObject:scrollListener];
}

- (void)removeScrollListener:(NSObject<UIScrollViewDelegate> *)scrollListener
{
  [_scrollListeners removeObject:scrollListener];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  [self updateClippedSubviews];
  NSTimeInterval now = CACurrentMediaTime();
  /**
   * TODO: this logic looks wrong, and it may be because it is. Currently, if _scrollEventThrottle
   * is set to zero (the default), the "didScroll" event is only sent once per scroll, instead of repeatedly
   * while scrolling as expected. However, if you "fix" that bug, ScrollView will generate repeated
   * warnings, and behave strangely (ListView works fine however), so don't fix it unless you fix that too!
   */
  if (_allowNextScrollNoMatterWhat ||
      (_scrollEventThrottle > 0 && _scrollEventThrottle < (now - _lastScrollDispatchTime))) {
    
    if (_DEPRECATED_sendUpdatedChildFrames) {
      // Calculate changed frames
      RCT_SEND_SCROLL_EVENT(onScroll, (@{@"updatedChildFrames": [self calculateChildFramesData]}));
    } else {
      RCT_SEND_SCROLL_EVENT(onScroll, nil);
    }
    
    // Update dispatch time
    _lastScrollDispatchTime = now;
    _allowNextScrollNoMatterWhat = NO;
  }
  
  RCT_FORWARD_SCROLL_EVENT(scrollViewDidScroll:scrollView);
  [self recalculateVisibleCells];
}

- (NSArray<NSDictionary *> *)calculateChildFramesData
{
  NSMutableArray<NSDictionary *> *updatedChildFrames = [NSMutableArray new];
  [[self reactSubviews] enumerateObjectsUsingBlock:
   ^(UIView *subview, NSUInteger idx, __unused BOOL *stop) {
     
     // Check if new or changed
     CGRect newFrame = subview.frame;
     BOOL frameChanged = NO;
     if (self->_cachedChildFrames.count <= idx) {
       frameChanged = YES;
       [self->_cachedChildFrames addObject:[NSValue valueWithCGRect:newFrame]];
     } else if (!CGRectEqualToRect(newFrame, [self->_cachedChildFrames[idx] CGRectValue])) {
       frameChanged = YES;
       self->_cachedChildFrames[idx] = [NSValue valueWithCGRect:newFrame];
     }
     
     // Create JS frame object
     if (frameChanged) {
       [updatedChildFrames addObject: @{
                                        @"index": @(idx),
                                        @"x": @(newFrame.origin.x),
                                        @"y": @(newFrame.origin.y),
                                        @"width": @(newFrame.size.width),
                                        @"height": @(newFrame.size.height),
                                        }];
     }
   }];
  
  return updatedChildFrames;
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
  _allowNextScrollNoMatterWhat = YES; // Ensure next scroll event is recorded, regardless of throttle
  RCT_SEND_SCROLL_EVENT(onScrollBeginDrag, nil);
  RCT_FORWARD_SCROLL_EVENT(scrollViewWillBeginDragging:scrollView);
  [self recalculateVisibleCells];
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
  NSDictionary *userData = @{
                             @"velocity": @{
                                 @"x": @(velocity.x),
                                 @"y": @(velocity.y)
                                 },
                             @"targetContentOffset": @{
                                 @"x": @(targetContentOffset->x),
                                 @"y": @(targetContentOffset->y)
                                 }
                             };
  RCT_SEND_SCROLL_EVENT(onScrollEndDrag, userData);
  RCT_FORWARD_SCROLL_EVENT(scrollViewWillEndDragging:scrollView withVelocity:velocity targetContentOffset:targetContentOffset);
  [self recalculateVisibleCells];
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
  RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndDragging:scrollView willDecelerate:decelerate);
  [self recalculateVisibleCells];
}

- (void)scrollViewWillBeginZooming:(UIScrollView *)scrollView withView:(UIView *)view
{
  RCT_SEND_SCROLL_EVENT(onScrollBeginDrag, nil);
  RCT_FORWARD_SCROLL_EVENT(scrollViewWillBeginZooming:scrollView withView:view);
  [self recalculateVisibleCells];
}

- (void)scrollViewDidEndZooming:(UIScrollView *)scrollView withView:(UIView *)view atScale:(CGFloat)scale
{
  RCT_SEND_SCROLL_EVENT(onScrollEndDrag, nil);
  RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndZooming:scrollView withView:view atScale:scale);
  [self recalculateVisibleCells];
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
  // Fire a final scroll event
  _allowNextScrollNoMatterWhat = YES;
  [self scrollViewDidScroll:scrollView];
  
  // Fire the end deceleration event
  RCT_SEND_SCROLL_EVENT(onMomentumScrollEnd, nil);
  RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndDecelerating:scrollView);
  [self recalculateVisibleCells];
}

- (void)scrollViewDidEndScrollingAnimation:(UIScrollView *)scrollView
{
  // Fire a final scroll event
  _allowNextScrollNoMatterWhat = YES;
  [self scrollViewDidScroll:scrollView];
  
  // Fire the end deceleration event
  RCT_SEND_SCROLL_EVENT(onMomentumScrollEnd, nil);
  RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndScrollingAnimation:scrollView);
  [self recalculateVisibleCells];
}

- (BOOL)scrollViewShouldScrollToTop:(UIScrollView *)scrollView
{
  for (NSObject<UIScrollViewDelegate> *scrollListener in _scrollListeners) {
    if ([scrollListener respondsToSelector:_cmd] &&
        ![scrollListener scrollViewShouldScrollToTop:scrollView]) {
      return NO;
    }
  }
  return YES;
}


@end
