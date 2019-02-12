#import <React/RCTShadowView.h>
#import "RHStoryInfo.h"

@interface RHShadowNativeFeed : RCTShadowView

@property(nonatomic, strong) NSArray* storyInfos; // [RHStoryInfo]
@property(nonatomic) CGFloat cellSeparatorHeight;

@property(nonatomic) CGFloat leadingCellSpace;
@property(nonatomic) CGFloat trailingCellSpace;

@end
