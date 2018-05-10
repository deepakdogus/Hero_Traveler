//
//  UIView+DetectHierarchyChanges.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 5/10/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "UIView+DetectHierarchyChanges.h"
#import <objc/runtime.h>

@implementation UIView (DetectHierarchyChanges)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    [self swizzleSetAlpha];
    [self swizzleDidMoveToSuperview];
  });
}

+ (void) swizzleSetAlpha
{
  Class class = [self class];
  
  SEL originalSelector = @selector(setAlpha:);
  SEL swizzledSelector = @selector(rehash_setAlpha:);
  
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
}

+ (void) swizzleDidMoveToSuperview
{
  Class class = [self class];
  
  SEL originalSelector = @selector(didMoveToWindow);
  SEL swizzledSelector = @selector(rehash_didMoveToWindow);
  
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
}

- (void) rehash_setAlpha:(CGFloat)newAlpha
{
  CGFloat lastAlpha = [self alpha];
  [self rehash_setAlpha:newAlpha];
  
  if (
      (lastAlpha > 0.5 && newAlpha <= 0.5) ||
      (lastAlpha <= 0.5 && newAlpha > 0.5))
  {
    [self hierachyChanged];
  }
}

- (void) rehash_didMoveToWindow
{
  [self rehash_didMoveToWindow];
  [self hierachyChanged];
}

- (void) hierachyChanged
{
  for (UIView* view in [self subviews])
  {
    [view hierachyChanged];
  }
}

@end
