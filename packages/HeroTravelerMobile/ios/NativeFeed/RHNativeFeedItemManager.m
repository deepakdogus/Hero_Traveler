#import "RHNativeFeedItemManager.h"
#import "RHShadowNativeFeedItem.h"
#import "RHNativeFeedItem.h"

@implementation RHNativeFeedItemManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RHNativeFeedItem new];
}

- (RCTShadowView *)shadowView
{
  return [[RHShadowNativeFeedItem alloc] init];
}

RCT_EXPORT_SHADOW_PROPERTY(cellNum, NSInteger)

@end

