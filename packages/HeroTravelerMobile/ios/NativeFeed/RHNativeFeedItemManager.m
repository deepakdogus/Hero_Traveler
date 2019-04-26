#import "RHNativeFeedItemManager.h"
#import "RHShadowNativeFeedItem.h"
#import "RHNativeFeedItem.h"

#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTUIManagerObserverCoordinator.h>

@interface RHNativeFeedItemManager () <RCTUIManagerObserver>

@end

@implementation RHNativeFeedItemManager
{
  NSHashTable<RHShadowNativeFeedItem *> *_shadowViews;
}

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RHNativeFeedItem alloc] init];
}

- (RCTShadowView *)shadowView
{
  RHShadowNativeFeedItem* shadowView = [[RHShadowNativeFeedItem alloc] initWithBridge:self.bridge];
  [_shadowViews addObject:shadowView];
  return shadowView;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_SHADOW_PROPERTY(cellNum, NSInteger)

#pragma mark - RCTUIManagerObserver

- (void)uiManagerWillPerformMounting:(__unused RCTUIManager *)uiManager
{
  for (RHShadowNativeFeedItem *shadowView in _shadowViews) {
    [shadowView uiManagerWillPerformMounting];
  }
}

- (void)setBridge:(RCTBridge *)bridge
{
  [super setBridge:bridge];
  [bridge.uiManager.observerCoordinator addObserver:self];
}

@end

