#import "RHShadowNativeFeed.h"
#import <React/RCTUtils.h>
#import "RHNativeFeed.h"
#import "RHShadowNativeFeedHeader.h"
#import "RHShadowNativeFeedItem.h"

#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation RHShadowNativeFeed
{
  __weak RCTBridge *_bridge;
  NSArray* _storyInfos;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
  }
  
  return self;
}

- (void)layoutSubviewsWithContext:(RCTLayoutContext)layoutContext
{
  RCTLayoutMetrics layoutMetrics = self.layoutMetrics;
  
  if (layoutMetrics.displayType == RCTDisplayTypeNone) {
    return;
  }
  
  float fullWidth = YGNodeStyleGetWidth(self.yogaNode).value;
  if (YGFloatIsUndefined(fullWidth)) {
    fullWidth = [UIScreen mainScreen].bounds.size.width;
  }

  CGFloat totalHeaderHeight = 0.f;
  for (RCTShadowView* childShadowView in [self reactSubviews])
  {
    if (![childShadowView isKindOfClass:[RHShadowNativeFeedHeader class]])
    {
      continue;
    }
    
    RHShadowNativeFeedHeader* header = (RHShadowNativeFeedHeader*) childShadowView;
    totalHeaderHeight += header.headerHeight;
    
    YGNodeRef childYogaNode = childShadowView.yogaNode;
    
    RCTAssert(!YGNodeIsDirty(childYogaNode), @"Attempt to get layout metrics from dirtied Yoga node.");

    RCTLayoutMetrics childLayoutMetrics = RCTLayoutMetricsFromYogaNode(childYogaNode);
    
    // layoutContext.absolutePosition.x += childLayoutMetrics.frame.origin.x;
    layoutContext.absolutePosition.y += childLayoutMetrics.frame.origin.y;
    
    [childShadowView layoutWithMetrics:childLayoutMetrics
                         layoutContext:layoutContext];
    
    // Recursive call.
    [childShadowView layoutSubviewsWithContext:layoutContext];
  }
  
  for (RHShadowNativeFeedItem* childShadowView in [self reactSubviews])
  {
    if (![childShadowView isKindOfClass:[RHShadowNativeFeedItem class]])
    {
      continue;
    }
    
    YGNodeRef childYogaNode = childShadowView.yogaNode;
    
    RCTAssert(!YGNodeIsDirty(childYogaNode), @"Attempt to get layout metrics from dirtied Yoga node.");
    
    RCTLayoutMetrics childLayoutMetrics = RCTLayoutMetricsFromYogaNode(childYogaNode);

    float x = childLayoutMetrics.frame.origin.x;
    float width = childLayoutMetrics.frame.size.width;
    float height = childLayoutMetrics.frame.size.height;
    
    if (YGFloatIsUndefined(x)) {
      x = 0;
    }
    
    if (YGFloatIsUndefined(width) || width <= 0) {
      width = fullWidth;
    }
    
    if (YGFloatIsUndefined(height) || height <= 0) {
      height = 100;
    }
   
    CGFloat yPos = totalHeaderHeight;
    
    for (int i = 0; i < childShadowView.cellNum; i++)
    {
      if (i >= _storyInfos.count)
      {
        break;
      }
      
      yPos += ((RHStoryInfo*)_storyInfos[i]).height + _cellSeparatorHeight;
    }
    
    height = childShadowView.cellNum < _storyInfos.count ? (((RHStoryInfo*)_storyInfos[childShadowView.cellNum]).height) : height;
   
    CGRect childFrame = {{
      RCTRoundPixelValue(x),
      RCTRoundPixelValue(yPos)
    }, {
      RCTRoundPixelValue(width),
      RCTRoundPixelValue(height)
    }};
    
    RCTLayoutContext localLayoutContext = layoutContext;
    localLayoutContext.absolutePosition.x += childFrame.origin.x;
    localLayoutContext.absolutePosition.y += childFrame.origin.y;
    
    [childShadowView layoutWithMinimumSize:childFrame.size
                               maximumSize:childFrame.size
                           layoutDirection:self.layoutMetrics.layoutDirection
                             layoutContext:localLayoutContext];

    RCTLayoutMetrics localLayoutMetrics = childShadowView.layoutMetrics;
    localLayoutMetrics.frame.origin = childFrame.origin; // Reinforcing a proper frame origin for the Shadow View.
    [childShadowView layoutWithMetrics:localLayoutMetrics layoutContext:localLayoutContext];

  }
}

- (void)uiManagerWillPerformMounting
{
  if (YGNodeIsDirty(self.yogaNode)) {
    return;
  }
  
  NSNumber *tag = self.reactTag;
  
  [_bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RHNativeFeed* view = (RHNativeFeed*)viewRegistry[tag];
    if (!view) {
      return;
    }
    
    view.storyInfos = self.storyInfos;
    view.cellSeparatorHeight = self.cellSeparatorHeight;
    view.leadingCellSpace = self.leadingCellSpace;
    view.trailingCellSpace = self.trailingCellSpace;
    [view recalculateBackingView];
  }];
}

- (NSArray*) storyInfos
{
  return _storyInfos;
}

- (void) setStoryInfos:(NSArray*)inStoryInfos
{
  NSMutableArray* mStoryInfos = [@[] mutableCopy];
 
  for (NSDictionary* storyInfoDict in inStoryInfos)
  {
    RHStoryInfo* storyInfo = [[RHStoryInfo alloc] initWithDictionary:storyInfoDict];
    [mStoryInfos addObject:storyInfo];
  }
  _storyInfos = [NSArray arrayWithArray:mStoryInfos];
}

@end
