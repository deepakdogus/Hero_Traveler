#import <React/RCTShadowView.h>
#import "RHStoryInfo.h"

@interface RHShadowNativeFeed : RCTShadowView

@property(nonatomic, strong) NSArray* storyInfos; // [RHStoryInfo]
@property(nonatomic) CGFloat cellSeparatorHeight; 

@end
