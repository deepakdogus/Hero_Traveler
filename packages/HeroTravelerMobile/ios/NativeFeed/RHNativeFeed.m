//
//  RHNativeFeed.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/24/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RHNativeFeed.h"
#import <React/RCTAssert.h>
#import <React/UIView+React.h>

@implementation RHNativeFeed
{
  RCTEventDispatcher *_eventDispatcher;
  NSArray* visibleCells;
  NSArray* visibleViews;
  
  UIScrollView* _scrollView;
  
  NSInteger _cellHeight;
  NSInteger _numCells;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  RCTAssertParam(eventDispatcher);
  
  if ((self = [super initWithFrame:CGRectZero])) {
    _eventDispatcher = eventDispatcher;

    _scrollView = [[UIScrollView alloc] initWithFrame:CGRectZero];
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
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithFrame:(CGRect)frame)
RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex
{
  [super insertReactSubview:view atIndex:atIndex];
  [_scrollView addSubview:view];
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

- (void) setContentSize
{
  _scrollView.contentSize = CGSizeMake([UIScreen mainScreen].bounds.size.width, _numCells*_cellHeight);
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
    
    for (int i = 0; i < _numCells; i++)
    {
      CGRect cellFrame = CGRectMake(0, i*_cellHeight, visibleBounds.size.width, _cellHeight);
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
