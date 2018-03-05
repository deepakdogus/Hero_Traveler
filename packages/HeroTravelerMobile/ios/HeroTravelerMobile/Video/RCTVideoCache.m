//
//  RCTVideoCache.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 1/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTVideoCache.h"
#import <AVFoundation/AVFoundation.h>
#import "RCTVideo.h"

#define VIDEO_FILE @"video.mp4"
#define DATE_LAST_OPENED_FILE @"lastOpened"

@implementation RCTVideoCache
{
  NSTimer* cleanupTimer;
}

+ (instancetype) get
{
  static RCTVideoCache* sharedInstance = nil;
  static dispatch_once_t pred;
  
  if (sharedInstance)
  {
    return sharedInstance;
  }
  
  dispatch_once(&pred, ^{
    sharedInstance = [RCTVideoCache alloc];
    sharedInstance = [sharedInstance init];
  });
  
  return sharedInstance;
}

- (instancetype) init
{
  if (self = [super init])
  {
    currentPrecacheList = @[];
    loadedVideos = @[];
    currentlyDownloadedFiles = @[];
    videoMuteStates = [@{} mutableCopy];
    currentDownloads = @[];
    
    __weak RCTVideoCache* weakCache = self;
    cleanupTimer = [NSTimer timerWithTimeInterval:2 repeats:YES block:^(NSTimer* _){
      [weakCache cleanupCacheInstances];
    }];
  }
  return self;
}

- (void) cleanupCacheInstances
{
  
}

+ (NSString*) urlToKey:(NSString*)url
{
  return [NSString stringWithFormat:@"%lx", (unsigned long)[url hash]];
}

+ (NSURL*) baseVideoCacheDirectory
{
  NSArray* paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  NSString* cacheDirectory = [paths objectAtIndex:0];
  
  return [[NSURL fileURLWithPath:cacheDirectory] URLByAppendingPathComponent:@"Videos"];
}

+ (NSURL*) cachedAssetDirectoryFromAssetKey:(NSString*)assetKey
{
  return [[RCTVideoCache baseVideoCacheDirectory] URLByAppendingPathComponent:assetKey];
}

+ (BOOL) ensureDirectory:(NSURL*)directory
{
  if (![[NSFileManager defaultManager] fileExistsAtPath:[directory path]])
  {
    NSError* error = nil;
    
    [[NSFileManager defaultManager] createDirectoryAtPath:[directory path]
                              withIntermediateDirectories:YES
                                               attributes:nil
                                                    error:&error];
    
    if (error)
    {
      NSLog(@"Could not create directory %@", directory);
      return NO;
    }
  }

  return YES;
}

+ (void) touchCachedAsset:(NSString*)assetKey
{
  NSURL* assetDirectory = [RCTVideoCache cachedAssetDirectoryFromAssetKey:assetKey];
  if (![RCTVideoCache ensureDirectory:assetDirectory])
  {
    return;
  }
  
  NSURL* dateLastOpenedLocation = [assetDirectory URLByAppendingPathComponent:DATE_LAST_OPENED_FILE];
  NSDictionary* dateInfo = @{@"date": [NSDate date]};
  [dateInfo writeToURL:dateLastOpenedLocation atomically:YES];
}

- (void) handleMutedStatus
{
  isPendingMutedUpdate = YES;
  dispatch_async(dispatch_get_main_queue(), ^{
    isPendingMutedUpdate = NO;
    
    NSMutableArray* unmutedPlayers = [@[] mutableCopy];
    
    for (VideoCacheItem* existingCacheItem in loadedVideos)
    {
      if (!existingCacheItem.assetKey)
      {
        continue;
      }
      
      NSNumber* isMuted = videoMuteStates[existingCacheItem.assetKey];
      
      if ([isMuted boolValue])
      {
        if (existingCacheItem.player.status == AVPlayerStatusReadyToPlay)
        {
          [existingCacheItem.player setVolume:0];
          [existingCacheItem.player setMuted:YES];
        }
        continue;
      }
      
      PlayingVideoItem* playingVideo = [existingCacheItem getControllingVideoView];
      if (!playingVideo || ![playingVideo.videoView isPlaying])
      {
        if (existingCacheItem.player.status == AVPlayerStatusReadyToPlay)
        {
          [existingCacheItem.player setVolume:0];
          [existingCacheItem.player setMuted:YES];
        }
        continue;
      }
      
      [unmutedPlayers addObject:playingVideo];
    }
    
    if ([unmutedPlayers count] == 1)
    {
      PlayingVideoItem* playingVideo = [unmutedPlayers objectAtIndex:0];
      if ([playingVideo videoCacheItem].player.status == AVPlayerStatusReadyToPlay)
      {
        [[playingVideo videoCacheItem].player setVolume:1];
        [[playingVideo videoCacheItem].player setMuted:NO];
      }
    }
    else if ([unmutedPlayers count] > 1)
    {
      // First see if any player is full screen
      PlayingVideoItem* fullscreenPlayer = nil;
      for (PlayingVideoItem* playingVideo in unmutedPlayers)
      {
        if ([playingVideo.videoView isDisplayingFullscreen])
        {
          fullscreenPlayer = playingVideo;
        }
      }
      
      if (fullscreenPlayer)
      {
        for (PlayingVideoItem* playingVideo in unmutedPlayers)
        {
          if (playingVideo == fullscreenPlayer)
          {
            if ([playingVideo videoCacheItem].player.status == AVPlayerStatusReadyToPlay)
            {
              [[playingVideo videoCacheItem].player setVolume:1];
              [[playingVideo videoCacheItem].player setMuted:NO];
            }
          }
          else
          {
            if ([playingVideo videoCacheItem].player.status == AVPlayerStatusReadyToPlay)
            {
              [[playingVideo videoCacheItem].player setVolume:0];
              [[playingVideo videoCacheItem].player setMuted:YES];
            }
          }
        }
        
        return;
      }
      
      // If multiple players are currently playing, then calculate who is taking up most of the visible screen
      CGFloat maxArea = 0.f;
      PlayingVideoItem* maxAreaVideoItem = nil;
      
      for (PlayingVideoItem* playingVideo in unmutedPlayers)
      {
        UIView* rootView = [playingVideo.videoView.window.subviews objectAtIndex:0];
        if (!rootView)
        {
          NSLog(@"No root view found for playing video");
          continue;
        }
        
        CGRect videoViewRectInWindow = [rootView convertRect:playingVideo.videoView.bounds fromView:playingVideo.videoView];
        CGRect videoViewVisibleRectInWindow = CGRectIntersection(rootView.bounds, videoViewRectInWindow);
        CGFloat videoViewArea = videoViewVisibleRectInWindow.size.width * videoViewVisibleRectInWindow.size.height;
        
        if (videoViewArea > maxArea)
        {
          maxArea = videoViewArea;
          maxAreaVideoItem = playingVideo;
        }
      }
      
      for (PlayingVideoItem* playingVideo in unmutedPlayers)
      {
        if (playingVideo == maxAreaVideoItem)
        {
          [[playingVideo videoCacheItem].player setVolume:1];
          [[playingVideo videoCacheItem].player setMuted:NO];
        }
        else
        {
          [[playingVideo videoCacheItem].player setVolume:0];
          [[playingVideo videoCacheItem].player setMuted:YES];
        }
      }
    }
  });
}

- (void) setAsset:(NSString*)assetKey isMuted:(BOOL)isMuted
{
  videoMuteStates[assetKey] = @(isMuted);
  [self handleMutedStatus];
}

- (void) dispatchDownloads
{
  for (VideoDownloadItem* download in currentDownloads)
  {
    [download startDownload];
  }
}

- (void) addAssetKeyToCurrentlyDownloadedFiles:(NSString*)assetKey
{
  NSMutableArray* mCurrentlyDownloadedFiles = [currentlyDownloadedFiles mutableCopy];
  [mCurrentlyDownloadedFiles addObject:assetKey];
  currentlyDownloadedFiles = [NSArray arrayWithArray:mCurrentlyDownloadedFiles];
}

- (PlayingVideoItem*) assetForUrl:(NSString*)url withOriginalUrl:(NSString*)originalUrl forVideoView:(RCTVideo*)videoView
{
  VideoCacheItem* cacheItem = [self videoCacheItemForUrl:url withOriginalUrl:originalUrl];
  [self purgeExcessVideos:cacheItem];
  [self dispatchDownloads];
  return [[PlayingVideoItem alloc] initWithVideoCacheItem:cacheItem videoView:videoView];
}

- (VideoCacheItem*) videoCacheItemForUrl:(NSString*)url withOriginalUrl:(NSString*)originalUrl
{
  NSString* assetKey = [RCTVideoCache urlToKey:url];

  VideoCacheItem* item = nil;

  item = [self loadedAsset:assetKey];

  if (item)
  {
    [item touch];
    return item;
  }

  item = [self downloadedAsset:assetKey streamUrl:url];

  if (item)
  {
    [item touch];
    return item;
  }

  item = [self createStreamingAsset:assetKey url:url];

  if (originalUrl.length > 0)
  {
    VideoDownloadItem* download = [[VideoDownloadItem alloc] initWithAssetKey:assetKey downloadUrl:[NSURL URLWithString:originalUrl]];
    download.delegate = self;
    NSMutableArray* mCurrentDownloads = [currentDownloads mutableCopy];
    [mCurrentDownloads addObject:download];
    currentDownloads = [NSArray arrayWithArray:mCurrentDownloads];
  }

  [item touch];
  return item;
}

- (VideoCacheItem*) loadedAsset:(NSString*) assetKey
{
  for (VideoCacheItem* existingCacheItem in loadedVideos)
  {
    if ([existingCacheItem.assetKey isEqualToString:assetKey])
    {
      return existingCacheItem;
    }
  }

  return nil;
}

- (VideoCacheItem*) downloadedAsset:(NSString*) assetKey streamUrl:(NSString*)streamUrl
{
  // Check local cache if video has been previously downloaded
  if ([currentlyDownloadedFiles containsObject:assetKey])
  {
    NSURL* assetDirectory = [RCTVideoCache cachedAssetDirectoryFromAssetKey:assetKey];
    NSURL* fileLocation = [assetDirectory URLByAppendingPathComponent:VIDEO_FILE];
    if (![[NSFileManager defaultManager] fileExistsAtPath:[assetDirectory path]] ||
        ![[NSFileManager defaultManager] fileExistsAtPath:[fileLocation path]])
    {
      NSMutableArray* mCurrentlyDownloadedFiles = [currentlyDownloadedFiles mutableCopy];
      [mCurrentlyDownloadedFiles removeObject:assetKey];
      currentlyDownloadedFiles = [NSArray arrayWithArray:mCurrentlyDownloadedFiles];
    }
    else
    {
      VideoCacheItem* cacheItem = [[VideoCacheItem alloc] initWithAssetKey:assetKey cachedLocation:fileLocation streamLocation:streamUrl];
      [RCTVideoCache touchCachedAsset:assetKey];
      
      NSMutableArray* mLoadedVideos = [loadedVideos mutableCopy];
      [mLoadedVideos addObject:cacheItem];
      loadedVideos = [NSArray arrayWithArray:mLoadedVideos];
      return cacheItem;
    }
  }

  return nil;
}
//assetDirectory

- (void) deleteSavedAsset:(NSString*)assetKey
{
  NSURL* assetDirectory = [RCTVideoCache cachedAssetDirectoryFromAssetKey:assetKey];

  if ([[NSFileManager defaultManager] fileExistsAtPath:[assetDirectory path]])
  {
    NSError* err = nil;
    [[NSFileManager defaultManager] removeItemAtURL:assetDirectory error:&err];
    
    if (err)
    {
      NSLog(@"Error deleting cached item: %@", err);
    }
  }
}

- (VideoCacheItem*) createStreamingAsset:(NSString*)assetKey url:(NSString*)url
{
  VideoCacheItem* cacheItem = [[VideoCacheItem alloc] initWithAssetKey:assetKey url:url];

  NSMutableArray* mLoadedVideos = [loadedVideos mutableCopy];
  [mLoadedVideos addObject:cacheItem];
  loadedVideos = [NSArray arrayWithArray:mLoadedVideos];

  return cacheItem;
}

- (void) asset:(NSString*)assetKey finishedAtLocation:(NSURL*)localFileUrl
{
  NSURL* assetDirectory = [RCTVideoCache cachedAssetDirectoryFromAssetKey:assetKey];
  [RCTVideoCache ensureDirectory:assetDirectory];
                   
  NSURL* videoAsset = [assetDirectory URLByAppendingPathComponent:VIDEO_FILE];
                   
  NSError* error = nil;
                   
  [[NSFileManager defaultManager] copyItemAtURL:localFileUrl
                                          toURL:videoAsset
                                          error:&error];

  if (error)
  {
    NSLog(@"Failed to move video %@ after download", localFileUrl);
  }
  else
  {
    [self addAssetKeyToCurrentlyDownloadedFiles:assetKey];
    [RCTVideoCache touchCachedAsset:assetKey];
  }

  [self dispatchDownloads];
}

- (void) purgeExcessVideos:(VideoCacheItem*)itemToKeep
{
  if (loadedVideos.count > 3)
  {
    NSMutableArray* mLoadedVideos = [@[] mutableCopy];
    
    NSArray* oldestVideosFirst = [loadedVideos sortedArrayUsingComparator:^(VideoCacheItem* a, VideoCacheItem* b){
      return [a.lastTouched compare:b.lastTouched];
    }];
    
    for (VideoCacheItem* existingCacheItem in oldestVideosFirst)
    {
      if (existingCacheItem == itemToKeep)
      {
        [mLoadedVideos addObject:existingCacheItem];
      }
      else
      {
        if (![existingCacheItem purge])
        {
          [mLoadedVideos addObject:existingCacheItem];
        }
        else
        {
          NSLog(@"Video purged");
        }
      }
    }
    
    loadedVideos = [NSArray arrayWithArray:mLoadedVideos];
  }
}

- (void) precacheAssets:(NSArray*)precacheAssets
{
//  for (NSString* uri in precacheAssets)
//  {
//    [self videoCacheItemForUri:uri];
//  }
//
//  currentPrecacheList = [NSArray arrayWithArray:precacheAssets];
//  [self dispatchDownloads];
}

- (void) handleMemoryWarning
{
  // TODO: Wipe any non-playing and non-precached items
}

- (void) handleAppOpen
{
  // TODO: clean temp directory
  //[NSURL fileURLWithPath:NSTemporaryDirectory()]
  
  // TODO: Purge excess videos from cache
  
  NSURL* cacheDirectory = [RCTVideoCache baseVideoCacheDirectory];
  NSError* error = nil;
  NSArray* directories = [[NSFileManager defaultManager]
   contentsOfDirectoryAtPath:[cacheDirectory path] error:&error];
  
  NSLog(@"Directories: %@", directories);
  
  if (error)
  {
    NSLog(@"Could not get contents of cache directory: %@", error);
    currentlyDownloadedFiles = @[];
  }
  else
  {
    NSMutableArray* mCurrentlyDownloadedFiles = [@[] mutableCopy];
    for (NSString* directory in directories)
    {
      NSString* assetKey = [directory lastPathComponent];
      [mCurrentlyDownloadedFiles addObject:assetKey];
    }
    currentlyDownloadedFiles = [NSArray arrayWithArray:mCurrentlyDownloadedFiles];
  }
}

- (void) handleAppClose
{
  // TODO: clean temp directory
  //[NSURL fileURLWithPath:NSTemporaryDirectory()]
  
  // TODO: Purge excess videos from cache
}

@end

