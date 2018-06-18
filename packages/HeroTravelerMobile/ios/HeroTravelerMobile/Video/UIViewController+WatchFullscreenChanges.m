//
//  UIViewController+WatchFullscreenChanges.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 6/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "UIViewController+WatchFullscreenChanges.h"
#import <UIKit/UIKit.h>
#import <objc/runtime.h>

NSString* const kFullscreenControllerChangedNotification = @"FullscreenControllerChangedNotification";
NSString* const kPresentedFullscreenControllerKey = @"presentedFullscreenController";

@implementation UIViewController (WatchFullscreenChanges)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    [self swizzlePresentViewController];
    [self swizzleDismissViewController];
  });
}

+ (void) swizzlePresentViewController
{
  Class class = [self class];
  
  SEL originalSelector = @selector(presentViewController:animated:completion:);
  SEL swizzledSelector = @selector(rehash_presentViewController:animated:completion:);
  
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

+ (void) swizzleDismissViewController
{
  Class class = [self class];
  
  SEL originalSelector = @selector(dismissViewControllerAnimated:completion:);
  SEL swizzledSelector = @selector(rehash_dismissViewControllerAnimated:completion:);
  
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

- (void) dispatchFullscreenChanges:(UIViewController*)vc
{
  UIWindow* mainWindow = (UIWindow*)[[UIApplication sharedApplication].windows objectAtIndex:0];
  if (mainWindow.rootViewController != self)
  {
    return;
  }

  if (vc && [NSStringFromClass([vc class]) isEqualToString:@"AVFullScreenViewController"])
  {
    [[NSNotificationCenter defaultCenter] postNotificationName:kFullscreenControllerChangedNotification object:nil userInfo:@{
                                                                                                                              kPresentedFullscreenControllerKey: vc,
                                                                                                                              }];
  }
  else
  {
    [[NSNotificationCenter defaultCenter] postNotificationName:kFullscreenControllerChangedNotification object:nil userInfo:@{
                                                                                                                              kPresentedFullscreenControllerKey: [NSNull null],
                                                                                                                              }];
  }
}

- (void) rehash_presentViewController:(UIViewController *)viewControllerToPresent animated:(BOOL)flag completion:(void (^)(void))completion
{
  [self rehash_presentViewController:viewControllerToPresent animated:flag completion:completion];
  [self dispatchFullscreenChanges:viewControllerToPresent];
}

- (void) rehash_dismissViewControllerAnimated:(BOOL)flag completion:(void (^)(void))completion
{
  [self rehash_dismissViewControllerAnimated:flag completion:completion];
  [self dispatchFullscreenChanges:nil];
}

@end
