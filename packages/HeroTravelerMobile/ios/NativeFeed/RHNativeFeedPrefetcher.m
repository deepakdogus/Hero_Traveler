//
//  RHNativeFeedPrefetcher.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 5/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RHNativeFeedPrefetcher.h"
#import <SDWebImage/SDWebImageDownloader.h>

@implementation RHNativeFeedPrefetcher

- (instancetype) initWithImagesToPrefetch:(NSSet*)imagesToPrefetch delegate:(NSObject<RHNativeFeedPrefetcherDelegate>*)delegate
{
  if (self = [super init])
  {
    _delegate = delegate;
    _imagesToPrefetch = imagesToPrefetch;
    imagesPendingCheck = _imagesToPrefetch;
    _loadedImages = [NSSet set];
    imagesPendingDownload = [NSSet set];
    imagesFailedDownload = [NSSet set];
    [self dispatchPrefetchCheck];
  }

  return self;
}

- (void) dispatchPrefetchCheck
{
  if (_invalidated)
  {
    return;
  }
  
  __weak RHNativeFeedPrefetcher* weakSelf = self;
  
  for (NSURL* url in imagesPendingCheck)
  {
    [[SDWebImageManager sharedManager] cachedImageExistsForURL:url completion:^(BOOL isInCache){
      RHNativeFeedPrefetcher* strongSelf = weakSelf;
      [strongSelf image:url isInCache:isInCache];
    }];
  }
}

- (void) image:(NSURL*)url isInCache:(BOOL)isInCache
{
  if (_invalidated)
  {
    return;
  }
  
  NSMutableSet* mImagesPendingCheck = [imagesPendingCheck mutableCopy];
  [mImagesPendingCheck removeObject:url];
  imagesPendingCheck = [NSSet setWithSet:mImagesPendingCheck];

  if (isInCache)
  {
    [self addUrlToLoaded:url];
  }
  else
  {
    NSMutableSet* mImagesPendingDownload = [imagesPendingDownload mutableCopy];
    [mImagesPendingDownload addObject:url];
    imagesPendingDownload = [NSSet setWithSet:mImagesPendingDownload];
  }
  
  if ([imagesPendingCheck count] == 0)
  {
    [self dispatchDownloads];
  }
}

- (void) dispatchDownloads
{
  if (_invalidated)
  {
    return;
  }
  
  NSMutableArray* mUrlsToFetch = [@[] mutableCopy];
  
  for (NSURL* url in imagesPendingDownload)
  {
    [mUrlsToFetch addObject:url];
  }
  
  SDWebImagePrefetcher* prefetcher = [SDWebImagePrefetcher sharedImagePrefetcher];
  
  prefetcher.delegate = self;
  prefetcher.maxConcurrentDownloads = 5;
  [prefetcher prefetchURLs:[NSArray arrayWithArray:mUrlsToFetch]];
}

- (void)imagePrefetcher:(nonnull SDWebImagePrefetcher *)imagePrefetcher didPrefetchURL:(nullable NSURL *)url finishedCount:(NSUInteger)finishedCount totalCount:(NSUInteger)totalCount
{
  if (_invalidated)
  {
    return;
  }

  __weak RHNativeFeedPrefetcher* weakSelf = self;

  [[SDWebImageManager sharedManager] cachedImageExistsForURL:url completion:^(BOOL isInCache){
    RHNativeFeedPrefetcher* strongSelf = weakSelf;
    [strongSelf image:url isInCacheAfterPrefetchAttempt:isInCache];
  }];
}

- (void)imagePrefetcher:(nonnull SDWebImagePrefetcher *)imagePrefetcher didFinishWithTotalCount:(NSUInteger)totalCount skippedCount:(NSUInteger)skippedCount
{
}

- (void) image:(NSURL*)url isInCacheAfterPrefetchAttempt:(BOOL)isInCache
{
  if (_invalidated)
  {
    return;
  }

  NSMutableSet* mImagesPendingDownload = [imagesPendingDownload mutableCopy];
  [mImagesPendingDownload removeObject:url];
  imagesPendingDownload = [NSSet setWithSet:mImagesPendingDownload];
  
  if (isInCache)
  {
    [self addUrlToLoaded:url];
  }
  else
  {
    [self addUrlToFailedDownload:url];
  }
  
  if ([imagesPendingDownload count] == 0)
  {
    [self dispatchFailedDownloads];
  }
}

- (void) dispatchFailedDownloads
{
  __weak RHNativeFeedPrefetcher* weakSelf = self;

  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(10 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    RHNativeFeedPrefetcher* strongSelf = weakSelf;
    [strongSelf _dispatchFailedDownloads];
  });
}

- (void) _dispatchFailedDownloads
{
  imagesPendingDownload = imagesFailedDownload;
  imagesFailedDownload = [NSSet set];
  
  [self dispatchDownloads];
}

- (void) addUrlToFailedDownload:(NSURL*)url
{
  NSMutableSet* mImagesFailedDownload = [imagesFailedDownload mutableCopy];
  [mImagesFailedDownload addObject:url];
  imagesFailedDownload = [NSSet setWithSet:mImagesFailedDownload];
}

- (void) addUrlToLoaded:(NSURL*)url
{
  NSMutableSet* mLoadedImages = [_loadedImages mutableCopy];
  [mLoadedImages addObject:url];
  _loadedImages = [NSSet setWithSet:mLoadedImages];
  
  [self.delegate prefetcher:self updatedCachedImages:_loadedImages];
}

- (void) invalidate
{
  _invalidated = YES;
}


@end
