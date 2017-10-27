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

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class class = [self class];
    
    SEL originalSelector = @selector(dirtyText);
    SEL swizzledSelector = @selector(rndj_dirtyText);
    
    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
    
    BOOL didAddMethod =
    class_addMethod(class,
                    originalSelector,
                    method_getImplementation(swizzledMethod),
                    method_getTypeEncoding(swizzledMethod));
    
    if (didAddMethod) {
      class_replaceMethod(class,
                          swizzledSelector,
                          method_getImplementation(originalMethod),
                          method_getTypeEncoding(originalMethod));
    } else {
      method_exchangeImplementations(originalMethod, swizzledMethod);
    }
  });
}

- (void)rndj_dirtyText {
  [self rndj_dirtyText];
  [self dirtyDraftJsText];
}

- (void) setDraftJsTextLifecycle:(RCTUpdateLifecycle)draftJsTextLifecycle
{
  NSNumber* draftJsLifecycleObject = [NSNumber numberWithUnsignedInteger:draftJsTextLifecycle];
  objc_setAssociatedObject(self, &kAssociatedDraftJsTextLifecycleKey, draftJsLifecycleObject, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (RCTUpdateLifecycle) draftJsTextLifecycle
{
  NSNumber* draftJsLifecycleObject = objc_getAssociatedObject(self, &kAssociatedDraftJsTextLifecycleKey);
  RCTUpdateLifecycle draftJsLifecycle = [draftJsLifecycleObject unsignedIntegerValue];
  return draftJsLifecycle;
}

- (void) dirtyDraftJsText
{
if ([self draftJsTextLifecycle] != RCTUpdateLifecycleDirtied) {
    [self setDraftJsTextLifecycle: RCTUpdateLifecycleDirtied];
    [[self superview] dirtyDraftJsText];
  }
}

- (BOOL) isDraftJsTextDirty
{
  return [self draftJsTextLifecycle] != RCTUpdateLifecycleComputed;
}

- (void) setDraftJsTextComputed
{
  [self setDraftJsTextLifecycle: RCTUpdateLifecycleComputed];
}

@end
