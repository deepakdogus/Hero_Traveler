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
#import "RCTVideoManager.h"
#import "UIViewController+WatchFullscreenChanges.h"

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
    cleanupTimer = [NSTimer scheduledTimerWithTimeInterval:1 repeats:YES block:^(NSTimer* _){
      [weakCache cleanupCacheInstances];
    }];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(fullscreenChanged:) name:kFullscreenControllerChangedNotification object:nil];
  }
  return self;
}

- (void) dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self name:kFullscreenControllerChangedNotification object:nil];
}

// Assumes just one AVPlayerLayer, so should only be used on player view controller views
- (AVPlayer*) getPlayerRecursivelyFromView:(UIView*)view
{
  if ([view.layer isKindOfClass:[AVPlayerLayer class]])
  {
    return ((AVPlayerLayer*)view.layer).player;
  }
  
  for (UIView* subview in [view subviews])
  {
    AVPlayer* player = [self getPlayerRecursivelyFromView:subview];
    if (player)
    {
      return player;
    }
  }
  
  return nil;
}

- (void) fullscreenChanged:(NSNotification*)notif
{
  dispatch_async(dispatch_get_main_queue(), ^{
    id obj = notif.userInfo[kPresentedFullscreenControllerKey];
    UIViewController* presentedViewController = [obj isKindOfClass:[UIViewController class]] ? (UIViewController*)obj : nil;
    AVPlayer* player = presentedViewController.view != nil ? [self getPlayerRecursivelyFromView:presentedViewController.view] : nil;
    
    for (VideoCacheItem* cacheItem in loadedVideos)
    {
      BOOL isPresentingFullscreen = cacheItem.player == player;
      [cacheItem setIsPresentingFullscreen:isPresentingFullscreen];
    }
  });
}

- (void) cleanupCacheInstances
{
  [self purgeExcessVideos];
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

- (void) pauseAllExcept:(VideoCacheItem*)item
{
  for (VideoCacheItem* testItem in loadedVideos)
  {
    if (testItem != item)
    {
      [testItem pauseFromUi];
    }
    else
    {
      [testItem playFromUi];
    }
  }
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
  [self purgeExcessVideos];
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

  if (originalUrl.length > 0 && [originalUrl hasPrefix:@"http"])
  {
    BOOL shouldDownload = YES;
    for (VideoDownloadItem* item in currentDownloads)
    {
      if ([item.assetKey isEqualToString:assetKey])
      {
        if (item.status == Pending || item.status == Downloading || item.status == Finished)
        {
          shouldDownload = NO;
        }
      }
    }

    if (shouldDownload)
    {
      VideoDownloadItem* download = [[VideoDownloadItem alloc] initWithAssetKey:assetKey downloadUrl:[NSURL URLWithString:originalUrl]];
      download.delegate = self;
      NSMutableArray* mCurrentDownloads = [currentDownloads mutableCopy];
      [mCurrentDownloads addObject:download];
      currentDownloads = [NSArray arrayWithArray:mCurrentDownloads];
    }
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
  if ([streamUrl hasPrefix:@"file"])
  {
    streamUrl = [RCTVideoManager fixFilePath:streamUrl];
    NSURL* fileLocation = [NSURL URLWithString:streamUrl];
    VideoCacheItem* cacheItem = [[VideoCacheItem alloc] initWithAssetKey:assetKey cachedLocation:fileLocation streamLocation:streamUrl];
    NSMutableArray* mLoadedVideos = [loadedVideos mutableCopy];
    [mLoadedVideos addObject:cacheItem];
    loadedVideos = [NSArray arrayWithArray:mLoadedVideos];
    return cacheItem;
  }
  
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

+ (void) moveVideo:(NSURL*)videoUrl toAssetKeyCache:(NSString*)assetKey
{
  NSURL* assetDirectory = [RCTVideoCache cachedAssetDirectoryFromAssetKey:assetKey];
  
  NSURL* fileLocationUrl = [assetDirectory URLByAppendingPathComponent:VIDEO_FILE];
  if (![RCTVideoCache ensureDirectory:assetDirectory] || !fileLocationUrl)
  {
    return;
  }

  NSError* err;
  
  [[NSFileManager defaultManager]
   moveItemAtURL:videoUrl toURL:fileLocationUrl error:&err];
  
  if (err)
  {
    NSLog(@"Error moving to cache: %@", err);
  }

  [[RCTVideoCache get] addAssetKeyToCurrentlyDownloadedFiles:assetKey];
  [self touchCachedAsset:assetKey];
}

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

- (void) purgeExcessVideos
{
  NSMutableArray* mLoadedVideos = [@[] mutableCopy];
  
  NSArray* newestVideosFirst = [loadedVideos sortedArrayUsingComparator:^(VideoCacheItem* a, VideoCacheItem* b){
    return [b.lastTouched compare:a.lastTouched];
  }];
  
  NSDate* currentTime = [NSDate date];
  
  NSInteger videosToKeep = 0;
  
  for (VideoCacheItem* existingCacheItem in newestVideosFirst)
  {
    if (fabs([currentTime timeIntervalSinceDate:existingCacheItem.lastTouched]) < 1.f)
    {
      [mLoadedVideos addObject:existingCacheItem];
      videosToKeep--;
    }
    else
    {
      if (videosToKeep > 0 || ![existingCacheItem purge])
      {
        [mLoadedVideos addObject:existingCacheItem];
      }
      else
      {
      }
      
      videosToKeep--;
    }
  }
  
  loadedVideos = [NSArray arrayWithArray:mLoadedVideos];
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

