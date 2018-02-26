#import "RHNativeFeedHeaderManager.h"
#import "RHShadowNativeFeedHeader.h"
#import "RHNativeFeedHeader.h"

@implementation RHNativeFeedHeaderManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RHNativeFeedHeader new];
}

- (RCTShadowView *)shadowView
{
  return [[RHShadowNativeFeedHeader alloc] init];
}

RCT_EXPORT_SHADOW_PROPERTY(headerHeight, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(sticky, BOOL)

@end
