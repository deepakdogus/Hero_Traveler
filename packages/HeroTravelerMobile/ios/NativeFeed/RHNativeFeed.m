#import "RHNativeFeed.h"
#import <React/RCTAssert.h>
#import <React/UIView+React.h>
#import "RHNativeFeedHeader.h"
#import "RHCustomScrollView.h"

@implementation RHNativeFeed
{
  RCTEventDispatcher *_eventDispatcher;
  NSArray* visibleCells;
  NSArray* visibleViews;
  
  UIScrollView* _scrollView;
  
  CGFloat _cellHeight;
  CGFloat _cellSeparatorHeight;
  NSInteger _numCells;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  RCTAssertParam(eventDispatcher);
  
  if ((self = [super initWithFrame:CGRectZero])) {
    _eventDispatcher = eventDispatcher;

    _scrollView = [[RHCustomScrollView alloc] initWithFrame:CGRectZero];
    _scrollView.translatesAutoresizingMaskIntoConstraints = NO;
    _scrollView.delegate = self;
    _scrollView.delaysContentTouches = YES;
    
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
//    _DEPRECATED_sendUpdatedChildFrames = NO;
//    _contentInset = UIEdgeInsetsZero;
//    _contentSize = CGSizeZero;
//    _lastClippedToRect = CGRectNull;
//
//    _scrollEventThrottle = 0.0;
//    _lastScrollDispatchTime = 0;
//    _cachedChildFrames = [NSMutableArray new];
//
//    _scrollListeners = [NSHashTable weakObjectsHashTable];
//
    [self addSubview:_scrollView];
    
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
//  [_scrollView addSubview:view];
//#if !TARGET_OS_TV
////  if ([view isKindOfClass:[RCTRefreshControl class]]) {
////    [_scrollView setRctRefreshControl:(RCTRefreshControl *)view];
////  } else
//#endif
//  {
////    RCTAssert(_contentView == nil, @"RCTScrollView may only contain a single subview");
////    _contentView = view;
////    RCTApplyTranformationAccordingLayoutDirection(_contentView, self.reactLayoutDirection);
//    [_scrollView addSubview:view];
//  }
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

- (void)removeReactSubview:(UIView *)subview
{
  [super removeReactSubview:subview];
//#if !TARGET_OS_TV
////  if ([subview isKindOfClass:[RCTRefreshControl class]]) {
////    [_scrollView setRctRefreshControl:nil];
////  } else
//#endif
//  {
////    RCTAssert(_contentView == subview, @"Attempted to remove non-existent subview");
////    _contentView = nil;
//  }
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

  if (!_onVisibleCellsChanged)
  {
    minCell = -2;
    maxCell = -2;
  }
  else if (_numCells <= 0)
  {
    minCell = -1;
    maxCell = -1;
  }
  else
  {
    CGRect visibleBounds = self.bounds;
    visibleBounds.origin = contentOffset;

    CGFloat fullCellHeight = _cellHeight + _cellSeparatorHeight;
    CGFloat totalHeaderSize = [self getTotalHeaderSize];
    for (int i = 0; i < _numCells; i++)
    {
      CGRect cellFrame = CGRectMake(0, totalHeaderSize+(i*fullCellHeight), visibleBounds.size.width, fullCellHeight);
      CGRect cellIntersection = CGRectIntersection(visibleBounds, cellFrame);
      
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
  
  if (minCell != self.minCellIndex || maxCell != self.maxCellIndex)
  {
    self.minCellIndex = minCell;
    self.maxCellIndex = maxCell;
    if (_onVisibleCellsChanged)
    {
      if (minCell < 0 || maxCell < 0)
      {
        _onVisibleCellsChanged(@{});
      }
      else
      {
        _onVisibleCellsChanged(@{
                                 @"visibleCells": @{
                                     @"minCell": @(minCell),
                                     @"maxCell": @(maxCell),
                                     }
                                 });
      }
    }
  }
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  [self recalculateVisibleCells];
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
  [self recalculateVisibleCells];
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
  [self recalculateVisibleCells];
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
  [self recalculateVisibleCells];
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
  [self recalculateVisibleCells];
}

- (void)scrollViewDidEndScrollingAnimation:(UIScrollView *)scrollView
{
  [self recalculateVisibleCells];
}

- (void)scrollViewDidScrollToTop:(UIScrollView *)scrollView
{
  [self recalculateVisibleCells];
}

@end
