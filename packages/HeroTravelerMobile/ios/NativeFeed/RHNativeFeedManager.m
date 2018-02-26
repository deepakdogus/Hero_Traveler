#import "RHNativeFeedManager.h"
#import "RHNativeFeed.h"
#import "RHShadowNativeFeed.h"

@implementation RHNativeFeedManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RHNativeFeed alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (RCTShadowView *)shadowView
{
  return [[RHShadowNativeFeed alloc] init];
}

RCT_EXPORT_SHADOW_PROPERTY(cellHeight, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(cellSeparatorHeight, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(startCell, NSInteger)


//@property(nonatomic, assign) NSInteger numPreloadBehindCells;
//@property(nonatomic, assign) NSInteger numPreloadAheadCells;

RCT_EXPORT_VIEW_PROPERTY(numPreloadBehindCells, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(numPreloadAheadCells, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(numCells, NSInteger)

RCT_EXPORT_VIEW_PROPERTY(onVisibleCellsChanged, RCTDirectEventBlock)

@end