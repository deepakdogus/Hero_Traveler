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
#import "VideoDownloadItem.h"

@class RCTVideo;

@interface RCTVideoCache : NSObject <DownloadItemDelegate>
{
  NSArray* currentPrecacheList; // [assetKeys]
  NSArray* loadedVideos; // [VideoCacheItem]
  NSArray* currentlyDownloadedFiles; // [assetKeys]
  NSArray* currentDownloads; // [VideoDownloadItem]
  
  NSMutableDictionary* videoMuteStates;
  
  BOOL isPendingMutedUpdate;
}

+ (instancetype) get;

+ (NSString*) urlToKey:(NSString*)url;

- (void) downloadVideoToCache:(NSURL*)url;

- (PlayingVideoItem*) assetForUrl:(NSString*)url withOriginalUrl:(NSString*)originalUrl forVideoView:(RCTVideo*)videoView;

- (void) handleMemoryWarning;

- (void) handleAppOpen;
- (void) handleAppClose;

- (void) handleMutedStatus;
- (void) setAsset:(NSString*)assetKey isMuted:(BOOL)isMuted;

- (void) deleteSavedAsset:(NSString*)assetKey;

@end
