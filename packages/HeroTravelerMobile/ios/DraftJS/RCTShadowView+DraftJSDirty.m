//
//  RCTShadowView+DraftJSDirty.m
//  RNDraftJs
//
//  Created by Andrew Beck on 10/24/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTShadowView+DraftJSDirty.h"
#import <objc/runtime.h>

static char kAssociatedDraftJsTextLifecycleKey;

@implementation RCTShadowView (DraftJSDirty)

//+ (void)load {
//  static dispatch_once_t onceToken;
//  dispatch_once(&onceToken, ^{
//    Class class = [self class];
//    
//    SEL originalSelector = @selector(dirtyText);
//    SEL swizzledSelector = @selector(rndj_dirtyText);
//    
//    Method originalMethod = class_getInstanceMethod(class, originalSelector);
//    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
//    
//    BOOL didAddMethod =
//    class_addMethod(class,
//                    originalSelector,
//                    method_getImplementation(swizzledMethod),
//                    method_getTypeEncoding(swizzledMethod));
//    
//    if (didAddMethod) {
//      class_replaceMethod(class,
//                          swizzledSelector,
//                          method_getImplementation(originalMethod),
//                          method_getTypeEncoding(originalMethod));
//    } else {
//      method_exchangeImplementations(originalMethod, swizzledMethod);
//    }
//  });
//}
//
//- (void)rndj_dirtyText {
//  [self rndj_dirtyText];
//  [self dirtyDraftJsText];
//}
//
//- (void) setDraftJsTextLifecycle:(RCTUpdateLifecycle)draftJsTextLifecycle
//{
//  NSNumber* draftJsLifecycleObject = [NSNumber numberWithUnsignedInteger:draftJsTextLifecycle];
//  objc_setAssociatedObject(self, &kAssociatedDraftJsTextLifecycleKey, draftJsLifecycleObject, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
//}
//
//- (RCTUpdateLifecycle) draftJsTextLifecycle
//{
//  NSNumber* draftJsLifecycleObject = objc_getAssociatedObject(self, &kAssociatedDraftJsTextLifecycleKey);
//  RCTUpdateLifecycle draftJsLifecycle = [draftJsLifecycleObject unsignedIntegerValue];
//  return draftJsLifecycle;
//}
//
//- (void) dirtyDraftJsText
//{
//if ([self draftJsTextLifecycle] != RCTUpdateLifecycleDirtied) {
//    [self setDraftJsTextLifecycle: RCTUpdateLifecycleDirtied];
//    [[self superview] dirtyDraftJsText];
//  }
//}
//
//- (BOOL) isDraftJsTextDirty
//{
//  return [self draftJsTextLifecycle] != RCTUpdateLifecycleComputed;
//}
//
//- (void) setDraftJsTextComputed
//{
//  [self setDraftJsTextLifecycle: RCTUpdateLifecycleComputed];
//}
//
//

//- (void)collectUpdatedFrames:(NSMutableSet<RCTShadowView *> *)viewsWithNewFrame
//                   withFrame:(CGRect)frame
//                      hidden:(BOOL)hidden
//            absolutePosition:(CGPoint)absolutePosition
//{
//  // This is not the core layout method. It is only used by RCTTextShadowView to layout
//  // nested views.
//  
//  if (_hidden != hidden) {
//    // The hidden state has changed. Even if the frame hasn't changed, add
//    // this ShadowView to viewsWithNewFrame so the UIManager will process
//    // this ShadowView's UIView and update its hidden state.
//    _hidden = hidden;
//    [viewsWithNewFrame addObject:self];
//  }
//  
//  if (!CGRectEqualToRect(frame, _frame)) {
//    YGNodeStyleSetPositionType(_yogaNode, YGPositionTypeAbsolute);
//    YGNodeStyleSetWidth(_yogaNode, frame.size.width);
//    YGNodeStyleSetHeight(_yogaNode, frame.size.height);
//    YGNodeStyleSetPosition(_yogaNode, YGEdgeLeft, frame.origin.x);
//    YGNodeStyleSetPosition(_yogaNode, YGEdgeTop, frame.origin.y);
//  }
//  
//  YGNodeCalculateLayout(_yogaNode, frame.size.width, frame.size.height, YGDirectionInherit);
//  [self applyLayoutNode:_yogaNode viewsWithNewFrame:viewsWithNewFrame absolutePosition:absolutePosition];
//}

@end
