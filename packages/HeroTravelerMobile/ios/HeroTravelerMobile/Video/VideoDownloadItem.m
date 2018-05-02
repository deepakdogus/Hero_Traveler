//
//  VideoDownloadItem.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "VideoDownloadItem.h"

@implementation VideoDownloadItem

- (instancetype) initWithAssetKey:(NSString*)assetKey downloadUrl:(NSURL*)url
{
  if (self == [super init])
  {
    _status = Pending;
    _assetKey = assetKey;
    _downloadUrl = url;
  }
  
  return self;
}

- (void) startDownload
{
  if (![NSThread isMainThread])
  {
    NSLog(@"Is not main thread!");
  }

  if (_status == Invalid)
  {
    return;
  }
  
  if (_status == CancelPendingPaused || _status == CancelPendingDownload)
  {
    _status = CancelPendingDownload;
    return;
  }
  
  if (_status > Errored || !_downloadUrl || _downloadTask)
  {
    return;
  }

  NSURLSession* session = [DownloadSessionManager mediaSession];
  NSData* resumeData = _resumeData;
  _resumeData = nil;
  
  if (resumeData)
  {
    _downloadTask = [session downloadTaskWithResumeData:resumeData];
  }
  else
  {
    _downloadTask = [session downloadTaskWithURL:_downloadUrl];
  }
  
  _downloadTask.priority = NSURLSessionTaskPriorityLow;

  [DownloadSessionManager registerItem:self forTask:_downloadTask];

  [_downloadTask resume];
  _status = Downloading;
}

- (void) stopDownload
{
  if (![NSThread isMainThread])
  {
    NSLog(@"Is not main thread!");
  }

  if (_status == Invalid)
  {
    return;
  }
  
  if (!_downloadTask && _status != CancelPendingDownload && _status != CancelPendingPaused)
  {
    _status = Paused;
    return;
  }

  _status = CancelPendingPaused;

  if (!_downloadTask && (_status == CancelPendingDownload || _status == CancelPendingPaused))
  {
    return;
  }
  
  [_downloadTask cancelByProducingResumeData:^(NSData* resumeData){
      _resumeData = resumeData;

      _status = Paused;
      if (_status == CancelPendingDownload)
      {
        [self startDownload];
      }
  }];
  [DownloadSessionManager unregisterItem:self forTask:_downloadTask];
  _downloadTask = nil;
}

- (void) invalidate
{
  if (![NSThread isMainThread])
  {
    NSLog(@"Is not main thread!");
  }
  
  _status = Invalid;

  [_downloadTask cancel];
  [DownloadSessionManager unregisterItem:self forTask:_downloadTask];
  _downloadTask = nil;
}

- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location
{
  if (![NSThread isMainThread])
  {
    NSLog(@"Is not main thread!");
  }
  
  if (_status == Invalid)
  {
    return;
  }

  if (downloadTask != _downloadTask)
  {
    NSLog(@"Got callback for another task");
  }

  _status = Finished;

  _downloadTask = nil;
}

- (void) URLSession:(NSURLSession*)session task:(NSURLSessionTask*)task didCompleteWithError:(nullable NSError*)error
{
  if (![NSThread isMainThread])
  {
    NSLog(@"Is not main thread!");
  }

  if (_status == Invalid)
  {
    return;
  }
  
  if (error)
  {
    NSLog(@"Downloading video to cache failed because %@", error);
    _status = Errored;
    _error = error;
  }
  
  _downloadTask = nil;
}

@end
