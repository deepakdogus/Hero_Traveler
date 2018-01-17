//
//  RCTVideoCache.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 1/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTVideoCache.h"
#import <AVFoundation/AVFoundation.h>

#define VIDEO_FILE @"video"
#define DATE_LAST_OPENED_FILE @"lastOpened"

@implementation RCTVideoCache

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
  }
  return self;
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

- (void) dispatchDownloads
{
  // TODO: Restrict this to N downloads
  
  for (VideoCacheItem* existingCacheItem in loadedVideos)
  {
    if (existingCacheItem.needsDownload)
    {
      [existingCacheItem startDownload];
    }
  }
}

- (void) addAssetKeyToCurrentlyDownloadedFiles:(NSString*)assetKey
{
  NSMutableArray* mCurrentlyDownloadedFiles = [currentlyDownloadedFiles mutableCopy];
  [mCurrentlyDownloadedFiles addObject:assetKey];
  currentlyDownloadedFiles = [NSArray arrayWithArray:mCurrentlyDownloadedFiles];
}

- (VideoCacheItem*) videoCacheItemForUri:(NSString*)uri
{
  NSString* assetKey = [RCTVideoCache urlToKey:uri];
  
  VideoCacheItem* cacheItem = nil;
  
  for (VideoCacheItem* existingCacheItem in loadedVideos)
  {
    if ([existingCacheItem.assetKey isEqualToString:assetKey])
    {
      cacheItem = existingCacheItem;
      break;
    }
  }
  
  if (!cacheItem)
  {
    // First check local cache if video has been previously downloaded
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
        cacheItem = [[VideoCacheItem alloc] initWithAssetKey:assetKey cachedLocation:fileLocation];
        [RCTVideoCache touchCachedAsset:assetKey];
        
        NSMutableArray* mLoadedVideos = [loadedVideos mutableCopy];
        [mLoadedVideos addObject:cacheItem];
        loadedVideos = [NSArray arrayWithArray:mLoadedVideos];
      }
    }
  }
  
  if (!cacheItem)
  {
    // Finally, create cacheItem from remote url if doesn't already exist or isn't cached
    
    __weak RCTVideoCache* weakCache = self;
    cacheItem = [[VideoCacheItem alloc] initWithAssetKey:assetKey
                                                     uri:uri
                                   finishedDownloadBlock:^(NSURL* location, VideoCacheItem* finishedItem)
                 {
                   RCTVideoCache* cache = weakCache;
                   
                   NSURL* assetDirectory = [RCTVideoCache cachedAssetDirectoryFromAssetKey:assetKey];
                   [RCTVideoCache ensureDirectory:assetDirectory];
                   
                   NSURL* videoAsset = [assetDirectory URLByAppendingPathComponent:VIDEO_FILE];
                   
                   NSError* error = nil;
                   
                   [[NSFileManager defaultManager] copyItemAtURL:location
                                                           toURL:videoAsset
                                                           error:&error];
                   
                   if (error)
                   {
                     NSLog(@"Failed to move video %@ after download", uri);
                   }
                   else
                   {
                     [cache addAssetKeyToCurrentlyDownloadedFiles:assetKey];
                     [RCTVideoCache touchCachedAsset:assetKey];
                   }
                   
                   [cache dispatchDownloads];
                 }];

    NSMutableArray* mLoadedVideos = [loadedVideos mutableCopy];
    [mLoadedVideos addObject:cacheItem];
    loadedVideos = [NSArray arrayWithArray:mLoadedVideos];
  }
  
  [cacheItem touch];
  
  return cacheItem;
}

- (void) precacheAssets:(NSArray*)precacheAssets
{
  for (NSString* uri in precacheAssets)
  {
    [self videoCacheItemForUri:uri];
  }
  
  currentPrecacheList = [NSArray arrayWithArray:precacheAssets];
  [self dispatchDownloads];
}

- (PlayingVideoItem*) assetForUrl:(NSString*)url forVideoView:(RCTVideo*)videoView
{
  VideoCacheItem* cacheItem = [self videoCacheItemForUri:url];
  [self dispatchDownloads];
  return [[PlayingVideoItem alloc] initWithVideoCacheItem:cacheItem videoView:videoView];
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

