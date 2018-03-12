#import "RHNativeFeed.h"
#import <React/RCTAssert.h>
#import <React/RCTRefreshControl.h>
#import <React/UIView+React.h>
#import "RHNativeFeedHeader.h"
#import "RHNativeFeedItem.h"
#import "RHCustomScrollView.h"
#import "RHScrollEvent.h"
#import <SDWebImage/SDWebImageDownloader.h>
#import "RHNativeFeedBackingView.h"

@interface RHDisposable : NSObject

@property(assign) BOOL isCancelled;

@end

@implementation RHDisposable

@end

@implementation RHNativeFeed
{
  RCTEventDispatcher *_eventDispatcher;
  NSArray* visibleCells;
  NSArray* visibleViews;
  
  RHCustomScrollView* _scrollView;
  
  CGFloat _cellSeparatorHeight;

  NSHashTable *_scrollListeners;
  uint16_t _coalescingKey;
  NSString *_lastEmittedEventName;
  NSTimeInterval _lastScrollDispatchTime;
  NSMutableArray<NSValue *> *_cachedChildFrames;
  BOOL _allowNextScrollNoMatterWhat;
  
  RHNativeFeedBackingView* _cellTemplatesView;

  // TODO: instead of tracking this context I could also create an object that can be invalidated
  //    that handles prefetching
  id loadImagesContext;
  NSInteger numPendingChecks;
  NSArray* _storyInfos;
  NSSet* loadedStoryImages;
  
  RHDisposable* dispatchCellRangeDisposable;
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
    
    _cellTemplatesView = [[RHNativeFeedBackingView alloc] initWithFrame:CGRectZero];
    _cellTemplatesView.userInteractionEnabled = YES;
    [_scrollView addSubview:_cellTemplatesView];

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

- (NSArray*) storyInfos
{
  return _storyInfos;
}

- (void) setStoryInfos:(NSArray*)inStoryInfos
{
  if (inStoryInfos.count == _storyInfos.count)
  {
    BOOL isEqual = YES;

    for (NSInteger i = 0; i < inStoryInfos.count; i++)
    {
      RHStoryInfo* a = inStoryInfos[i];
      RHStoryInfo* b = _storyInfos[i];

      if (![a isEqualToStoryInfo:b])
      {
        isEqual = NO;
        break;
      }
    }

    if (isEqual)
    {
      return;
    }
  }

  _storyInfos = inStoryInfos;

  NSInteger numImagesToCheck = 0;
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    if (storyInfo.headerImage)
    {
      numImagesToCheck++;
    }
  }

  loadedStoryImages = [NSSet set];
  id currentLoadImagesContext = [[NSObject alloc] init];
  loadImagesContext = currentLoadImagesContext;
  numPendingChecks = numImagesToCheck;

  [self setContentSize];
  [self recalculateVisibleCells];

  __weak RHNativeFeed* weakFeed = self;
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    NSURL* storyImage = storyInfo.headerImage;
    
    if (!storyImage)
    {
      continue;
    }

    [[SDWebImageManager sharedManager] cachedImageExistsForURL:storyImage completion:^(BOOL isInCache){
      RHNativeFeed* strongSelf = weakFeed;
      [strongSelf imageUrl:storyImage wasLoaded:isInCache context:currentLoadImagesContext];
    }];
  }
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
    [self dispatchDownloadsInContext:context];
  }

  [self setContentSize];
}

- (void) dispatchDownloadsInContext:(id)context
{
  if (context != loadImagesContext)
  {
    return;
  }
  
  NSMutableArray* mUrlsToFetch = [@[] mutableCopy];
  
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    NSURL* storyImage = storyInfo.headerImage;
    if (storyImage && ![loadedStoryImages containsObject:storyImage])
    {
      [mUrlsToFetch addObject:storyImage];
    }
    
  }
  
  SDWebImagePrefetcher* prefetcher = [SDWebImagePrefetcher sharedImagePrefetcher];
  
  prefetcher.delegate = self;
  prefetcher.maxConcurrentDownloads = 5;
  [prefetcher prefetchURLs:mUrlsToFetch];
}

- (void)imagePrefetcher:(nonnull SDWebImagePrefetcher *)imagePrefetcher didPrefetchURL:(nullable NSURL *)imageURL finishedCount:(NSUInteger)finishedCount totalCount:(NSUInteger)totalCount
{
  NSMutableSet* mLoadedStoryImages = [loadedStoryImages mutableCopy];
  [mLoadedStoryImages addObject:imageURL];
  loadedStoryImages = [NSSet setWithSet:mLoadedStoryImages];

  [self setContentSize];
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
}

- (void) recalculateBackingView
{
  if (self.currentMinCellIndex < 0 && self.currentMaxCellIndex < 0)
  {
    _cellTemplatesView.frame = CGRectZero;
    [_cellTemplatesView setHeights:@[]];
  }
  
  CGFloat headerHeight = [self getTotalHeaderHeight];
  CGFloat yOffset = headerHeight;
  CGFloat backingViewHeight = 0.f;
  
  NSMutableArray* cellHeights = [@[] mutableCopy];
  for (int i = 0; i < self.currentMaxCellIndex; i++)
  {
    if (i >= _storyInfos.count)
    {
      break;
    }
    
    RHStoryInfo* storyInfo = _storyInfos[i];
    
    CGFloat cellHeight = storyInfo.height;
    
    // Prep work for making dynamically sized cells
    if (i < self.currentMinCellIndex)
    {
      yOffset += cellHeight + _cellSeparatorHeight;
    }
    else
    {
      [cellHeights addObject:@(cellHeight)];
      backingViewHeight += cellHeight + _cellSeparatorHeight;
    }
  }
  
  _cellTemplatesView.frame = CGRectMake(0,
                                        yOffset,
                                        self.bounds.size.width,
                                        backingViewHeight);
  [_cellTemplatesView setHeights:cellHeights];
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

- (void) setCellSeparatorHeight:(CGFloat)cellSeparatorHeight
{
  _cellSeparatorHeight = cellSeparatorHeight;
  [_cellTemplatesView setSeparatorHeight:cellSeparatorHeight];
  [self recalculateVisibleCells];
}

- (CGFloat) cellSeparatorHeight
{
  return _cellSeparatorHeight;
}

- (CGFloat) getTotalHeaderHeight
{
  CGFloat totalHeaderHeight = 0.f;

  for (UIView* view in self.subviews)
  {
    if ([view isKindOfClass:[RHNativeFeedHeader class]])
    {
      totalHeaderHeight += view.frame.size.height;
    }
  }
  
  return totalHeaderHeight;
}

- (CGFloat) getTotalCellHeight
{
  CGFloat totalCellHeight = 0.f;
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    totalCellHeight += storyInfo.height + _cellSeparatorHeight;
  }
  
  return totalCellHeight;
}

- (void) setContentSize
{
  NSUInteger numLoadedCells = [self numLoadedCells];
  _scrollView.contentSize = CGSizeMake(self.bounds.size.width,
                                       [self getTotalHeaderHeight] + [self getTotalCellHeight]);
  
  for (RHNativeFeedItem* view in _scrollView.subviews)
  {
    if ([view isKindOfClass:[RHNativeFeedItem class]])
    {
      view.hidden = view.cellNum >= numLoadedCells;
    }
  }
}

- (void) setBounds:(CGRect)bounds
{
  [super setBounds:bounds];
  [self recalculateVisibleCells];
}

- (void) recalculateVisibleCells
{
  [self recalculateVisibleCells:_scrollView.contentOffset];
}

- (void) recalculateVisibleCells:(CGPoint)contentOffset
{
  NSInteger minCell = NSIntegerMax;
  NSInteger maxCell = NSIntegerMin;
  NSInteger playingCell = 0;

  NSUInteger numCells = _storyInfos.count;
  
  if (!_onVisibleCellsChanged)
  {
    minCell = -2;
    maxCell = -2;
    playingCell = -2;
  }
  else if (numCells <= 0)
  {
    minCell = -1;
    maxCell = -1;
    playingCell = -1;
  }
  else
  {
    CGRect visibleBounds = self.bounds;
    visibleBounds.origin = contentOffset;

    CGFloat maxIntersectionSize = 0;
    CGFloat curY = [self getTotalHeaderHeight];
    for (int i = 0; i < numCells; i++)
    {
      RHStoryInfo* storyInfo = _storyInfos[i];
      
      CGRect cellFrame = CGRectMake(0, curY, visibleBounds.size.width, storyInfo.height);
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
      
      curY += storyInfo.height + _cellSeparatorHeight;
    }
    
    minCell = MAX(minCell-_numPreloadAheadCells, 0);
    maxCell = MIN(maxCell+1+_numPreloadAheadCells, numCells);
  }
  
  if (minCell > maxCell)
  {
    minCell = maxCell;
  }
  
  if (minCell == self.currentMinCellIndex && maxCell == self.currentMaxCellIndex)
  {
    return;
  }

  RHDisposable* disposable = [[RHDisposable alloc] init];
  dispatchCellRangeDisposable.isCancelled = YES;
  dispatchCellRangeDisposable = disposable;
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.05f * NSEC_PER_SEC)),
                 dispatch_get_main_queue(), ^{
                   if (disposable.isCancelled)
                   {
                     return;
                   }
                   
                   if (self.currentMinCellIndex != self.lastSentMinCellIndex || self.currentMaxCellIndex != self.lastSentMaxCellIndex || playingCell != self.playingCellIndex)
                   {
                     self.lastSentMinCellIndex = self.currentMinCellIndex;
                     self.lastSentMaxCellIndex = self.currentMaxCellIndex;
                     self.playingCellIndex = playingCell;
                     if (_onVisibleCellsChanged)
                     {
                       if (self.currentMinCellIndex < 0 || self.currentMaxCellIndex < 0 || playingCell < 0)
                       {
                         _onVisibleCellsChanged(@{});
                       }
                       else
                       {
                         _onVisibleCellsChanged(@{
                                                  @"visibleCells": @{
                                                      @"minCell": @(self.currentMinCellIndex),
                                                      @"maxCell": @(self.currentMaxCellIndex),
                                                      },
                                                  @"playingCell": @(playingCell),
                                                  });
                       }
                     }
                   }
                 });
  
  self.currentMinCellIndex = minCell;
  self.currentMaxCellIndex = maxCell;
  
  [self setContentSize];
  [self recalculateBackingView];
}

- (NSUInteger) numLoadedCells
{
  NSInteger i = 0;
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    NSURL* storyImage = storyInfo.headerImage;
    
    if (!storyImage || [loadedStoryImages containsObject:storyImage])
    {
      i++;
    }
  }
  
  return i;
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
