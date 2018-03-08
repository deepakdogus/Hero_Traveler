#import "RHShadowNativeFeedItem.h"
#import "RHNativeFeedItem.h"

@implementation RHShadowNativeFeedItem

- (NSDictionary<NSString *, id> *)processUpdatedProperties:(NSMutableSet<RCTApplierBlock> *)applierBlocks
                                          parentProperties:(NSDictionary<NSString *, id> *)parentProperties
{
  parentProperties = [super processUpdatedProperties:applierBlocks
                                    parentProperties:parentProperties];
  
  [applierBlocks addObject:^(NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RHNativeFeedItem *view = (RHNativeFeedItem *)viewRegistry[self.reactTag];
    view.cellNum = self.cellNum;
  }];
  
  return parentProperties;
}

@end
