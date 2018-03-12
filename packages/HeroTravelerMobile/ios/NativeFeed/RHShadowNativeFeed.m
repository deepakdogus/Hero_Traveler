#import "RHShadowNativeFeed.h"
#import <React/RCTUtils.h>
#import "RHNativeFeed.h"
#import "RHShadowNativeFeedHeader.h"
#import "RHShadowNativeFeedItem.h"

@implementation RHShadowNativeFeed
{
  NSArray* _storyInfos;
}

- (void)applyLayoutToChildren:(YGNodeRef)node
            viewsWithNewFrame:(NSMutableSet<RCTShadowView *> *)viewsWithNewFrame
             absolutePosition:(CGPoint)absolutePosition
{
  float fullWidth = YGNodeStyleGetWidth(self.yogaNode).value;
  if (YGFloatIsUndefined(fullWidth)) {
    fullWidth = [UIScreen mainScreen].bounds.size.width;
  }

  CGFloat totalHeaderHeight = 0.f;
  for (RCTShadowView* shadowView in [self reactSubviews])
  {
    if (![shadowView isKindOfClass:[RHShadowNativeFeedHeader class]])
    {
      continue;
    }
    
    RHShadowNativeFeedHeader* header = (RHShadowNativeFeedHeader*) shadowView;
    
    CGRect childFrame = {{
      0.f,
      RCTRoundPixelValue(totalHeaderHeight)
    }, {
      RCTRoundPixelValue(fullWidth),
      RCTRoundPixelValue(header.headerHeight)
    }};
    
    [shadowView collectUpdatedFrames:viewsWithNewFrame
                           withFrame:childFrame
                              hidden:false
                    absolutePosition:absolutePosition];

    totalHeaderHeight += header.headerHeight;
  }
  
  for (RHShadowNativeFeedItem* shadowView in [self reactSubviews])
  {
    if (![shadowView isKindOfClass:[RHShadowNativeFeedItem class]])
    {
      continue;
    }

    YGNodeRef childNode = shadowView.yogaNode;
    float x = YGNodeLayoutGetLeft(childNode);
    float width = YGNodeStyleGetWidth(childNode).value;
    float height = YGNodeStyleGetHeight(childNode).value;
    
    if (YGFloatIsUndefined(x)) {
      x = 0;
    }
    
    if (YGFloatIsUndefined(width)) {
      width = fullWidth;
    }
    
    if (YGFloatIsUndefined(height)) {
      height = 100;
    }
    
    CGFloat yPos = totalHeaderHeight;

    for (int i = 0; i < shadowView.cellNum; i++)
    {
      if (i >= _storyInfos.count)
      {
        break;
      }

      yPos += ((RHStoryInfo*)_storyInfos[i]).height + _cellSeparatorHeight;
    }
    
    height = shadowView.cellNum < _storyInfos.count ? ((RHStoryInfo*)_storyInfos[shadowView.cellNum]).height : height;
    
    CGRect childFrame = {{
      x,
      RCTRoundPixelValue(yPos)
    }, {
      RCTRoundPixelValue(width),
      RCTRoundPixelValue(height)
    }};
    
    [shadowView collectUpdatedFrames:viewsWithNewFrame
                           withFrame:childFrame
                              hidden:false
                    absolutePosition:absolutePosition];
  }
}


- (NSDictionary<NSString *, id> *)processUpdatedProperties:(NSMutableSet<RCTApplierBlock> *)applierBlocks
                                          parentProperties:(NSDictionary<NSString *, id> *)parentProperties
{
  parentProperties = [super processUpdatedProperties:applierBlocks
                                    parentProperties:parentProperties];
  
  [applierBlocks addObject:^(NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RHNativeFeed *view = (RHNativeFeed *)viewRegistry[self.reactTag];
    view.storyInfos = self.storyInfos;
    view.cellSeparatorHeight = self.cellSeparatorHeight;
    [view recalculateBackingView];
  }];
  
  return parentProperties;
}

- (NSArray*) storyInfos
{
  return _storyInfos;
}

- (void) setStoryInfos:(NSArray*)inStoryInfos
{
  NSMutableArray* mStoryInfos = [@[] mutableCopy];
 
  for (NSDictionary* storyInfoDict in inStoryInfos)
  {
    RHStoryInfo* storyInfo = [[RHStoryInfo alloc] initWithDictionary:storyInfoDict];
    [mStoryInfos addObject:storyInfo];
  }
  _storyInfos = [NSArray arrayWithArray:mStoryInfos];
}

@end
