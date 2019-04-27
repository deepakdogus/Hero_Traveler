//
//  RNDJDraftJSEditorManager.m
//  RNDraftJs
//
//  Created by Andrew Beck on 10/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJDraftJSEditorManager.h"

#import <yoga/Yoga.h>
#import <React/RCTAccessibilityManager.h>
#import <React/RCTAssert.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/RCTShadowView+Layout.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTUIManagerObserverCoordinator.h>

#import "RNDJShadowDraftJSEditor.h"
#import "RNDJDraftJSEditor.h"

#import "RCTShadowView+DraftJSDirty.h"

@interface RNDJDraftJSEditorManager () <RCTUIManagerObserver>

@end

@implementation RNDJDraftJSEditorManager
{
  NSHashTable<RNDJShadowDraftJSEditor *> *_shadowViews;
}

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNDJDraftJSEditor new];
}

- (RCTShadowView *)shadowView
{
  RNDJShadowDraftJSEditor* shadowView = [[RNDJShadowDraftJSEditor alloc] initWithBridge:self.bridge];
  [_shadowViews addObject:shadowView];
  return shadowView;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - View properties

RCT_EXPORT_VIEW_PROPERTY(onInsertTextRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBackspaceRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNewlineRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSelectionChangeRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onReplaceRangeRequest, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(selectionColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(selectionOpacity, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(cursorColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(cursorOpacity, CGFloat)

#pragma mark - Shadow properties

RCT_EXPORT_SHADOW_PROPERTY(defaultAtomicWidth, CGFloat)
RCT_EXPORT_SHADOW_PROPERTY(defaultAtomicHeight, CGFloat)

RCT_EXPORT_SHADOW_PROPERTY(content, NSDictionary)
RCT_EXPORT_SHADOW_PROPERTY(blockFontTypes, NSDictionary)
RCT_EXPORT_SHADOW_PROPERTY(inlineStyleFontTypes, NSDictionary)
RCT_EXPORT_SHADOW_PROPERTY(selection, NSDictionary)
RCT_EXPORT_SHADOW_PROPERTY(autocomplete, NSDictionary)

RCT_EXPORT_SHADOW_PROPERTY(placeholderText, NSString)

RCT_EXPORT_SHADOW_PROPERTY(paragraphSpacing, CGFloat)

RCT_EXPORT_SHADOW_PROPERTY(selectable, BOOL)

#pragma mark - RCTUIManagerObserver

- (void)uiManagerWillPerformMounting:(__unused RCTUIManager *)uiManager
{
  for (RNDJShadowDraftJSEditor *shadowView in _shadowViews) {
    [shadowView uiManagerWillPerformMounting];
  }
}

- (void)setBridge:(RCTBridge *)bridge
{
  [super setBridge:bridge];
  _shadowViews = [NSHashTable weakObjectsHashTable];
  [bridge.uiManager.observerCoordinator addObserver:self];
}

@end

//- (void)setBridge:(RCTBridge *)bridge
//{
//  [super setBridge:bridge];
//  _shadowViews = [NSHashTable weakObjectsHashTable];
//  
//  [bridge.uiManager.observerCoordinator addObserver:self];
//  
//  [[NSNotificationCenter defaultCenter] addObserver:self
//                                           selector:@selector(handleDidUpdateMultiplierNotification)
//                                               name:RCTAccessibilityManagerDidUpdateMultiplierNotification
//                                             object:bridge.accessibilityManager];
//}
