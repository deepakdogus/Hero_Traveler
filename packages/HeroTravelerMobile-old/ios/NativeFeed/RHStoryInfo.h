#import <UIKit/UIKit.h>

@interface RHStoryInfo : NSObject

- (instancetype) initWithDictionary:(NSDictionary*)infoDict;
- (BOOL) isEqualToStoryInfo:(RHStoryInfo*)other;

@property(nonatomic, strong) NSURL* headerImage;
@property(nonatomic, assign) CGFloat height;
@property(nonatomic, strong) NSArray* contentMedia;

@end

