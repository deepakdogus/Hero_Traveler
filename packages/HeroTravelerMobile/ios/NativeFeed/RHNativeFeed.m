#import "RHNativeFeed.h"
#import <React/RCTAssert.h>
#import <React/RCTRefreshControl.h>
#import <React/UIView+React.h>
#import <React/UIView+Private.h>
#import "RHNativeFeedHeader.h"
#import "RHNativeFeedItem.h"
#import "RHCustomScrollView.h"
#import "RHScrollEvent.h"
#import "RHNativeFeedBackingView.h"
#import "RCTVideo.h"

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
  
  CGRect _lastClippedToRect;
  NSArray* _cellTemplatesViews;

  NSArray* _storyInfos;
  NSSet* loadedStoryImages;
  RHNativeFeedPrefetcher* prefetcher;

  RHDisposable* dispatchCellRangeDisposable;
  
  BOOL storyInfosChanged;
  CGRect lastCalculatedBounds;
  CGFloat lastCellSeperatorHeight;
  NSInteger lastPreloadAheadCells;
  NSInteger lastPreloadBehindCells;
  NSUInteger lastNumLoadedCells;
  
  BOOL heightsChanged;
  CGFloat lastTotalHeaderHeight;
  CGFloat lastBackingViewSeperatorHeight;
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
    
    _cellTemplatesViews = @[];
    
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
  storyInfosChanged = YES;
  heightsChanged = YES;

  NSInteger numImagesToCheck = 0;
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    if (storyInfo.headerImage)
    {
      numImagesToCheck++;
    }
  }

  loadedStoryImages = [NSSet set];

  [self setContentSize];
  [self recalculateVisibleCells];
  
  NSMutableSet* imagesToPrefetch = [NSMutableSet set];

  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    NSURL* storyImage = storyInfo.headerImage;
    
    if (!storyImage)
    {
      continue;
    }
    
    [imagesToPrefetch addObject:storyImage];
  }
  
  [prefetcher invalidate];
  prefetcher = [[RHNativeFeedPrefetcher alloc] initWithImagesToPrefetch:[NSSet setWithSet:imagesToPrefetch] delegate:self];
}

- (void) prefetcher:(RHNativeFeedPrefetcher*)prefetcher updatedCachedImages:(NSSet*)cachedImages
{
  loadedStoryImages = cachedImages;
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
  CGFloat headerHeight = [self getTotalHeaderHeight];
  
  if (fabs(lastTotalHeaderHeight - headerHeight) < 1.f && !heightsChanged && fabs(lastBackingViewSeperatorHeight - _cellSeparatorHeight) < 1.f)
  {
    return;
  }
  
  for (UIView* view in _cellTemplatesViews)
  {
    [view removeFromSuperview];
  }
  
  NSMutableArray* newTemplates = [@[] mutableCopy];

  heightsChanged = NO;
  lastBackingViewSeperatorHeight = _cellSeparatorHeight;
  lastTotalHeaderHeight = headerHeight;
  
  CGFloat leadingViewY = headerHeight - self.leadingCellSpace;
  CGRect leadingViewRect = CGRectMake(0, leadingViewY, self.bounds.size.width, self.leadingCellSpace);
  UIView* leadingView = [[UIView alloc] initWithFrame:leadingViewRect];
  leadingView.backgroundColor = [UIColor orangeColor];
  leadingView.userInteractionEnabled = YES;
  [_scrollView insertSubview:leadingView atIndex:0];
  [newTemplates addObject:leadingView];
  
  CGFloat yOffset = headerHeight;
  
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    CGFloat cellHeight = storyInfo.height;
    
    if (cellHeight >= 1.f)
    {
      CGSize backingSize = CGSizeMake(self.bounds.size.width, cellHeight);
      
      CGRect backingViewFrame = CGRectMake(0, yOffset, backingSize.width, backingSize.height+_cellSeparatorHeight);
      UIImageView* backingView = [[UIImageView alloc] initWithFrame:backingViewFrame];
      backingView.image = [RHNativeFeedBackingView backingImageSized:backingSize withSeperator:_cellSeparatorHeight];
      backingView.userInteractionEnabled = YES;
      [_scrollView insertSubview:backingView atIndex:0];

      [newTemplates addObject:backingView];
    }

    yOffset += cellHeight + _cellSeparatorHeight;
  }
  
  CGFloat trailingViewY = yOffset;
  CGRect trailingViewRect = CGRectMake(0, trailingViewY, self.bounds.size.width, self.trailingCellSpace);
  UIView* trailingView = [[UIView alloc] initWithFrame:trailingViewRect];
  trailingView.backgroundColor = [UIColor orangeColor];
  trailingView.userInteractionEnabled = YES;
  [_scrollView insertSubview:trailingView atIndex:0];
  [newTemplates addObject:trailingView];

  _cellTemplatesViews = [NSArray arrayWithArray:newTemplates];
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
  [self recalculateVisibleCells];
  [self recalculateBackingView];
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
  
  return totalHeaderHeight + self.leadingCellSpace;
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
  
  CGFloat totalLoadedCellHeight = 0.f;
  NSInteger cellNum = 0;
  for (RHStoryInfo* storyInfo in _storyInfos)
  {
    if (cellNum >= numLoadedCells)
    {
      break;
    }
    
    totalLoadedCellHeight += storyInfo.height + _cellSeparatorHeight;
    cellNum += 1;
  }

  _scrollView.contentSize = CGSizeMake(self.bounds.size.width,
                                       [self getTotalHeaderHeight] + totalLoadedCellHeight + self.trailingCellSpace);
  
  for (RHNativeFeedItem* view in _scrollView.subviews)
  {
    if ([view isKindOfClass:[RHNativeFeedItem class]])
    {
      BOOL willBeHidden = view.cellNum >= numLoadedCells;
      
      if (view.hidden && !willBeHidden)
      {
        view.hidden = willBeHidden;
        [self recursivelyReapplyModifiers:view];
      }
      else
      {
        view.hidden = willBeHidden;
      }
    }
  }
}

- (void) recursivelyReapplyModifiers:(UIView*)view
{
  if ([view isKindOfClass:[RCTVideo class]])
  {
    [((RCTVideo*) view) applyModifiers];
  }
  
  for (UIView* subview in [[view subviews] copy])
  {
    [self recursivelyReapplyModifiers:subview];
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
  CGRect visibleBounds = self.bounds;
  visibleBounds.origin = contentOffset;
  
  CGRect boundsOverlapWithLastCalculation = CGRectIntersection(visibleBounds, lastCalculatedBounds);
  
  CGFloat boundsDiff = fabs(boundsOverlapWithLastCalculation.size.height - visibleBounds.size.height);

  CGFloat heightChange = fabs(lastCellSeperatorHeight-_cellSeparatorHeight);
  NSUInteger numLoadedCells = [self numLoadedCells];

  if (!storyInfosChanged && boundsDiff < 10.f && heightChange < 1.f && lastPreloadAheadCells == _numPreloadAheadCells && lastPreloadBehindCells == _numPreloadBehindCells)
  {
    [self setContentSize];
    [self recalculateBackingView];
    return;
  }
  
  storyInfosChanged = NO;
  lastCalculatedBounds = visibleBounds;
  lastCellSeperatorHeight = _cellSeparatorHeight;
  lastPreloadAheadCells = _numPreloadAheadCells;
  lastPreloadBehindCells = _numPreloadBehindCells;
  lastNumLoadedCells = numLoadedCells;
  
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
    
    minCell = MAX(minCell-_numPreloadBehindCells, 0);
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
    else
    {
      break;
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

- (void)updateClippedSubviews
{
  // Find a suitable view to use for clipping
  UIView *clipView = [self react_findClipView];
  if (!clipView) {
    return;
  }
  
  static const CGFloat leeway = 1.0;
  
  const CGSize contentSize = _scrollView.contentSize;
  const CGRect bounds = _scrollView.bounds;
  const BOOL scrollsHorizontally = contentSize.width > bounds.size.width;
  const BOOL scrollsVertically = contentSize.height > bounds.size.height;
  
  const BOOL shouldClipAgain =
  CGRectIsNull(_lastClippedToRect) ||
  !CGRectEqualToRect(_lastClippedToRect, bounds) ||
  (scrollsHorizontally && (bounds.size.width < leeway || fabs(_lastClippedToRect.origin.x - bounds.origin.x) >= leeway)) ||
  (scrollsVertically && (bounds.size.height < leeway || fabs(_lastClippedToRect.origin.y - bounds.origin.y) >= leeway));
  
  if (shouldClipAgain) {
    const CGRect clipRect = CGRectInset(clipView.bounds, -leeway, -leeway);
    [self react_updateClippedSubviewsWithClipRect:clipRect relativeToView:clipView];
    _lastClippedToRect = bounds;
  }
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
