//
//  RCTVideoCache.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 1/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "VideoCacheItem.h"

@class RCTVideo;

@interface RCTVideoCache : NSObject
{
  NSArray* currentPrecacheList; // [assetKeys]
  NSArray* loadedVideos; // [VideoCacheItem]
  NSArray* currentlyDownloadedFiles; // [assetKeys]
}

+ (instancetype) get;

+ (NSString*) urlToKey:(NSString*)url;

- (void) precacheAssets:(NSArray*)precacheAssets; // set as array of urls

- (PlayingVideoItem*) assetForUrl:(NSString*)url forVideoView:(RCTVideo*)videoView;

- (void) handleMemoryWarning;

- (void) handleAppOpen;
- (void) handleAppClose;

@end