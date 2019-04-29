#import "RHNativeFeedManager.h"
#import "RHNativeFeed.h"
#import "RHShadowNativeFeed.h"

#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTUIManagerObserverCoordinator.h>

@interface RHNativeFeedManager () <RCTUIManagerObserver>

@end

@implementation RHNativeFeedManager
{
  NSHashTable<RHShadowNativeFeed *> *_shadowViews;
}

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RHNativeFeed alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (RCTShadowView *)shadowView
{
  RHShadowNativeFeed* shadowView = [[RHShadowNativeFeed alloc] initWithBridge:self.bridge];
  [_shadowViews addObject:shadowView];
  return shadowView;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_SHADOW_PROPERTY(cellSeparatorHeight, CGFloat)
//RCT_EXPORT_SHADOW_PROPERTY(storyInfos, NSArray)
+ (NSArray<NSString *> *)propConfigShadow_storyInfos RCT_DYNAMIC {
  return @[@"NSArray"];
  
}

//@property(nonatomic, assign) NSInteger numPreloadBehindCells;
//@property(nonatomic, assign) NSInteger numPreloadAheadCells;

RCT_EXPORT_SHADOW_PROPERTY(leadingCellSpace, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(trailingCellSpace, CGFloat)

RCT_EXPORT_VIEW_PROPERTY(numPreloadBehindCells, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(numPreloadAheadCells, NSInteger)

RCT_EXPORT_VIEW_PROPERTY(onVisibleCellsChanged, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onScrollBeginDrag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScroll, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScrollEndDrag, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMomentumScrollBegin, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMomentumScrollEnd, RCTDirectEventBlock)

#pragma mark - RCTUIManagerObserver

- (void)uiManagerWillPerformMounting:(__unused RCTUIManager *)uiManager
{
  for (RHShadowNativeFeed *shadowView in _shadowViews) {
    [shadowView uiManagerWillPerformMounting];
  }
}

- (void)setBridge:(RCTBridge *)bridge
{
  [super setBridge:bridge];
  _shadowViews = [NSHashTable weakObjectsHashTable];
  [bridge.uiManager.observerCoordinator addObserver:self];
}

@end
