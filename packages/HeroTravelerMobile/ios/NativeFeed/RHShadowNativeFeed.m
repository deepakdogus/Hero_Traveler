#import "RHShadowNativeFeed.h"
#import <React/RCTUtils.h>
#import "RHNativeFeed.h"

@implementation RHShadowNativeFeed

- (void)applyLayoutToChildren:(YGNodeRef)node
            viewsWithNewFrame:(NSMutableSet<RCTShadowView *> *)viewsWithNewFrame
             absolutePosition:(CGPoint)absolutePosition
{
  float fullWidth = YGNodeStyleGetWidth(self.yogaNode).value;
  if (YGFloatIsUndefined(fullWidth)) {
    fullWidth = [UIScreen mainScreen].bounds.size.width;
  }
  
  NSInteger i = 0;
  for (RCTShadowView* shadowView in [self reactSubviews])
  {
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
    
    CGRect childFrame = {{
      x,
      RCTRoundPixelValue((i+_startCell)*_cellHeight)
    }, {
      RCTRoundPixelValue(width),
      RCTRoundPixelValue(_cellHeight)
    }};

    [shadowView collectUpdatedFrames:viewsWithNewFrame
                      withFrame:childFrame
                         hidden:false
               absolutePosition:absolutePosition];

    i++;
  }
}

//
//  // Run layout on subviews.
//  CGFloat availableWidth = self.availableSize.width;
//  NSTextStorage *textStorage = [self buildTextStorageForWidth:availableWidth widthMode:YGMeasureModeExactly];
//  NSLayoutManager *layoutManager = textStorage.layoutManagers.firstObject;
//  NSTextContainer *textContainer = layoutManager.textContainers.firstObject;
//  NSRange glyphRange = [layoutManager glyphRangeForTextContainer:textContainer];
//  NSRange characterRange = [layoutManager characterRangeForGlyphRange:glyphRange actualGlyphRange:NULL];
//  [layoutManager.textStorage enumerateAttribute:kShadowViewAttributeName inRange:characterRange options:0 usingBlock:^(RCTShadowView *child, NSRange range, BOOL *_) {
//    if (child) {
//      YGNodeRef childNode = child.yogaNode;
//      float width = YGNodeStyleGetWidth(childNode).value;
//      float height = YGNodeStyleGetHeight(childNode).value;
//      if (YGFloatIsUndefined(width)) {
//        width = self.defaultAtomicWidth;
//      }
//      if (YGFloatIsUndefined(height)) {
//        height = self.defaultAtomicHeight;
//      }
//
////      if (YGFloatIsUndefined(width) || YGFloatIsUndefined(height)) {
////        RCTLogError(@"Views nested within a <RNDJShadowDraftJsEditor> must have a width and height");
////      }
//      UIFont *font = [textStorage attribute:NSFontAttributeName atIndex:range.location effectiveRange:nil];
//      CGRect glyphRect = [layoutManager boundingRectForGlyphRange:range inTextContainer:textContainer];
//      CGRect childFrame = {{
//        RCTRoundPixelValue(glyphRect.origin.x),
//        RCTRoundPixelValue(glyphRect.origin.y + self.paddingAsInsets.top + glyphRect.size.height - height + font.descender)
//      }, {
//        RCTRoundPixelValue(width),
//        RCTRoundPixelValue(height)
//      }};
//      
//      NSRange truncatedGlyphRange = [layoutManager truncatedGlyphRangeInLineFragmentForGlyphAtIndex:range.location];
//      BOOL childIsTruncated = NSIntersectionRange(range, truncatedGlyphRange).length != 0;
//      
//      [child collectUpdatedFrames:viewsWithNewFrame
//                        withFrame:childFrame
//                           hidden:childIsTruncated
//                 absolutePosition:absolutePosition];
//    }
//  }];
//}

- (NSDictionary<NSString *, id> *)processUpdatedProperties:(NSMutableSet<RCTApplierBlock> *)applierBlocks
                                          parentProperties:(NSDictionary<NSString *, id> *)parentProperties
{
  parentProperties = [super processUpdatedProperties:applierBlocks
                                    parentProperties:parentProperties];
  
  [applierBlocks addObject:^(NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RHNativeFeed *view = (RHNativeFeed *)viewRegistry[self.reactTag];
    view.cellHeight = self.cellHeight;
  }];
  
  return parentProperties;
}

@end
