/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCTPushNotificationManager.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "SplashScreen.h"
#import <IQKeyboardManager/IQKeyboardManager.h>
#import "RCTVideoCache.h"
#import "RCTVideoManager.h"
#import <react-native-branch/RNBranch.h>
@import GooglePlaces;
@import GoogleMaps;

void myExceptionHandler(NSException *exception)
{
  NSArray *stack = [exception callStackReturnAddresses];
  NSLog(@"Stack trace: %@", stack);
}

@implementation AppDelegate

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSString *token = [[deviceToken description] stringByTrimmingCharactersInSet: [NSCharacterSet characterSetWithCharactersInString:@"<>"]];
  token = [token stringByReplacingOccurrencesOfString:@" " withString:@""];
  NSLog(@"content---%@", token);
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [IQKeyboardManager sharedManager].enable = YES;
  [IQKeyboardManager sharedManager].enableAutoToolbar = NO;
  [GMSPlacesClient provideAPIKey:@"AIzaSyCwX6XPRPYobXzotl-P7k3iiA2mNedMz1g"];
  [GMSServices provideAPIKey:@"AIzaSyCwX6XPRPYobXzotl-P7k3iiA2mNedMz1g"];
  [[RCTVideoCache get] handleAppOpen];

  NSSetUncaughtExceptionHandler(&myExceptionHandler);
   // Uncomment this line to use the test key instead of the live one.
  // [RNBranch useTestInstance];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // <-- add this

  NSURL *jsCodeLocation;

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"HeroTravelerMobile"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [SplashScreen show];
  return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
    return [RNBranch continueUserActivity:userActivity];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            sourceApplication:(NSString *)sourceApplication
            annotation:(id)annotation {

  NSString *myUrl = url.absoluteString;


//  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                                openURL:url
//                                                      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
//                                                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
//                  ];

//  if(!handled) {
//    return [RCTLinkingManager application:application openURL:url
//                        sourceApplication:sourceApplication annotation:annotation];
//  }

//  return handled;


//  if ([myUrl containsString:@])

  if ([myUrl containsString:@"com.herotraveler.herotraveler-beta"]) {
    return [RCTLinkingManager application:application
                              openURL:url
                              sourceApplication:sourceApplication
                              annotation:annotation];
  } else {
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                      openURL:url
                                                      sourceApplication:sourceApplication
                                                      annotation:annotation];
  }
}

- (void)applicationWillTerminate:(UIApplication *)application
{
  [[RCTVideoCache get] handleAppClose];
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application
{
  [[RCTVideoCache get] handleMemoryWarning];
}

//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
//{
//
//}

@end
