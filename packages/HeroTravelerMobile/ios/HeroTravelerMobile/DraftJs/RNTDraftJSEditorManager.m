//
//  RNTDraftJSEditorManager.m
//  RNDraftJs
//
//  Created by Andrew Beck on 10/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNTDraftJSEditorManager.h"

#import <yoga/Yoga.h>
#import <React/RCTAccessibilityManager.h>
#import <React/RCTAssert.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/UIView+React.h>

#import "RNTShadowDraftJSEditor.h"
#import "RNTDraftJSEditor.h"

#import "RCTShadowView+DraftJSDirty.h"


//static void collectDirtyNonTextDescendants(RNTShadowDraftJSEditor *shadowView, NSMutableArray *nonTextDescendants) {
//  for (RCTShadowView *child in shadowView.reactSubviews) {
//    if ([child isKindOfClass:[RNTShadowDraftJSEditor class]]) {
//      collectDirtyNonTextDescendants((RNTShadowDraftJSEditor *)child, nonTextDescendants);
//    } else if ([child isTextDirty]) {
//      [nonTextDescendants addObject:child];
//    }
//  }
//}

@interface RNTShadowDraftJSEditor (Private)

- (NSTextStorage *)buildTextStorageForWidth:(CGFloat)width widthMode:(YGMeasureMode)widthMode;

@end


@implementation RNTDraftJSEditorManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNTDraftJSEditor new];
}

- (RCTShadowView *)shadowView
{
  return [RNTShadowDraftJSEditor new];
}

#pragma mark - View properties

RCT_EXPORT_VIEW_PROPERTY(onInsertTextRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBackspaceRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNewlineRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFocusChanged, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSelectionChangeRequest, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(selectionColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(selectionOpacity, CGFloat)

#pragma mark - Shadow properties

RCT_EXPORT_SHADOW_PROPERTY(content, NSDictionary)
RCT_EXPORT_SHADOW_PROPERTY(blockFontTypes, NSDictionary)
RCT_EXPORT_SHADOW_PROPERTY(inlineStyleFontTypes, NSDictionary)
RCT_EXPORT_SHADOW_PROPERTY(selection, NSDictionary)

RCT_EXPORT_SHADOW_PROPERTY(fontFamily, NSString)
RCT_EXPORT_SHADOW_PROPERTY(fontSize, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(fontWeight, NSString)
RCT_EXPORT_SHADOW_PROPERTY(fontStyle, NSString)
RCT_EXPORT_SHADOW_PROPERTY(fontVariant, NSArray)
RCT_EXPORT_SHADOW_PROPERTY(letterSpacing, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(color, UIColor)
RCT_EXPORT_SHADOW_PROPERTY(opacity, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(textAlign, NSTextAlignment)
RCT_EXPORT_SHADOW_PROPERTY(lineHeight, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(textDecorationStyle, NSUnderlineStyle)
RCT_EXPORT_SHADOW_PROPERTY(textDecorationLine, RNTTextDecorationLineType)
RCT_EXPORT_SHADOW_PROPERTY(textDecorationColor, UIColor)
RCT_EXPORT_SHADOW_PROPERTY(textShadowOffset, CGSize)
RCT_EXPORT_SHADOW_PROPERTY(textShadowRadius, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(textShadowColor, UIColor)

RCT_EXPORT_SHADOW_PROPERTY(selectable, BOOL)
RCT_EXPORT_SHADOW_PROPERTY(allowFontScaling, BOOL)

- (RCTViewManagerUIBlock)uiBlockToAmendWithShadowViewRegistry:(NSDictionary<NSNumber *, RCTShadowView *> *)shadowViewRegistry
{
  for (RCTShadowView *rootView in shadowViewRegistry.allValues) {
    if (![rootView isReactRootView]) {
      // This isn't a root view
      continue;
    }
    
    if (![rootView isDraftJsTextDirty]) {
      // No text processing to be done
      continue;
    }
    
    NSMutableArray<RCTShadowView *> *queue = [NSMutableArray arrayWithObject:rootView];
    for (NSInteger i = 0; i < queue.count; i++) {
      RCTShadowView *shadowView = queue[i];
      RCTAssert([shadowView isDraftJsTextDirty], @"Don't process any nodes that don't have dirty text");
      
      if ([shadowView isKindOfClass:[RNTShadowDraftJSEditor class]]) {
        ((RNTShadowDraftJSEditor *)shadowView).fontSizeMultiplier = self.bridge.accessibilityManager.multiplier;
        [(RNTShadowDraftJSEditor *)shadowView recomputeText];
      } else {
        for (RCTShadowView *child in [shadowView reactSubviews]) {
          if ([child isDraftJsTextDirty]) {
            [queue addObject:child];
          }
        }
      }
      
      [shadowView setDraftJsTextComputed];
    }
  }
  
  return nil;
}

- (RCTViewManagerUIBlock)uiBlockToAmendWithShadowView:(RNTShadowDraftJSEditor *)shadowView
{
  NSNumber *reactTag = shadowView.reactTag;
  UIEdgeInsets padding = shadowView.paddingAsInsets;
  
  return ^(RCTUIManager *uiManager, NSDictionary<NSNumber *, RNTDraftJSEditor *> *viewRegistry) {
    RNTDraftJSEditor *text = viewRegistry[reactTag];
    text.contentInset = padding;
  };
}

@end

