//
//  VideoCacheItem.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 1/14/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

#define DOWNLOAD_IDENTIFIER @"HeroTravellerDownload"

@class VideoCacheItem;
@class RCTVideo;

typedef void (^FinishedDownloadBlock)(NSURL* location, VideoCacheItem* videoCacheItem);

@class PlayingVideoItem;

@interface VideoCacheItem : NSObject <AVAssetDownloadDelegate>
{
//  _repeat, _paused should live here on video cache item??????
//  but are defined by the "topmost"
  NSArray* currentPlayingVideoItems;
  
  BOOL isPlaybackStalled;
  BOOL isVideoLoaded;
  NSDictionary* loadedInfo;
  BOOL isBuffering;

  NSDictionary* errorDict;
  NSArray* videoMetadata;
  
  BOOL _playerItemObserversSet;
  BOOL _playerObserversSet;
  
  BOOL pendingItemApplyModifiers;
}

@property(readonly, strong) NSString* assetKey;
@property(readonly, strong) AVURLAsset* asset;

@property(readonly) BOOL needsDownload;

@property(readonly, strong) AVPlayerItem* playerItem;
@property(readonly, strong) AVPlayer* player;

@property(readonly, strong) NSDate* lastTouched; // Used to determine which assets to purge on memory warning

@property(readonly) NSInteger numPlayingInstances;

@property(readonly, strong) FinishedDownloadBlock finishedDownloadBlock;

- (instancetype) initWithAssetKey:(NSString*)assetKey uri:(NSString*)uri finishedDownloadBlock:(FinishedDownloadBlock)finishedDownloadBlock;
- (instancetype) initWithAssetKey:(NSString*)assetKey cachedLocation:(NSURL*)url;
- (void) touch;

- (void) startDownload;
- (void) stopDownload;

@property(readonly, strong) AVAssetDownloadURLSession* downloadSession;

@property(readonly, strong) AVAssetDownloadTask* downloadTask;
@property(readonly, strong) NSURL* localFileLocation;

- (PlayingVideoItem*) getControllingVideoView;

- (void) applyModifiers;

- (BOOL) purge;

@end

@interface PlayingVideoItem : NSObject
{
  VideoCacheItem* videoCacheItem;
}

@property(readonly, weak) RCTVideo* videoView;

- (instancetype) initWithVideoCacheItem:(VideoCacheItem*)videoCacheItem videoView:(RCTVideo*)videoView;

- (void) requestApplyModifiers;
- (VideoCacheItem*) videoCacheItem;

@end

@interface WeakPlayingVideoItem : NSObject

@property(readonly, weak) PlayingVideoItem* playingVideoItem;

- (instancetype) initWithPlayingVideoItem:(PlayingVideoItem*)playingVideoItem;

@end

