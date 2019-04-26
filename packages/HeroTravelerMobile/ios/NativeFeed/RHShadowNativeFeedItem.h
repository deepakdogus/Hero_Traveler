#import <React/RCTShadowView.h>

@interface RHShadowNativeFeedItem : RCTShadowView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property(nonatomic) NSInteger cellNum;

- (void)uiManagerWillPerformMounting;

@end

