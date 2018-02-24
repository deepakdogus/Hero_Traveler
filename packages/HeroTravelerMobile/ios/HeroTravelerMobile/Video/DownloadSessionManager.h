//
//  DownloadSessionManager.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@class VideoDownloadItem;

@interface DownloadSessionManager : NSObject<NSURLSessionDownloadDelegate>
{
  NSArray* listenerPairs;
}

+ (NSURLSession*) mediaSession;
+ (void) registerItem:(VideoDownloadItem*)item forTask:(NSURLSessionDownloadTask*)task;
+ (void) unregisterItem:(VideoDownloadItem*)item forTask:(NSURLSessionDownloadTask*)task;

@end
