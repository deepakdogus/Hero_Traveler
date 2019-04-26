#import "RHShadowNativeFeedItem.h"
#import "RHNativeFeedItem.h"
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation RHShadowNativeFeedItem
{
  __weak RCTBridge *_bridge;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
  }
  
  return self;
}

- (void)uiManagerWillPerformMounting
{
  if (YGNodeIsDirty(self.yogaNode)) {
    return;
  }
  
  NSNumber *tag = self.reactTag;

  [_bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RHNativeFeedItem* feedItem = (RHNativeFeedItem*)viewRegistry[tag];
    if (!feedItem) {
      return;
    }
    
    feedItem.cellNum = self.cellNum;
  }];
}

@end
