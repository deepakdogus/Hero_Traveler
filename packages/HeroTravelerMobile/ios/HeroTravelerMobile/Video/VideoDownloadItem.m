//
//  VideoDownloadItem.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "VideoDownloadItem.h"

@implementation VideoDownloadItem

- (instancetype) initWithAssetKey:(NSString*)assetKey downloadUrl:(NSString*)url
{
  if (self == [super init])
  {
    _status = Pending;

    NSURLSessionConfiguration* sessionConfiguration = [self sessionConfiguration];
    _downloadSession = [AVAssetDownloadURLSession
                        sessionWithConfiguration:sessionConfiguration
                        assetDownloadDelegate:self
                        delegateQueue:[NSOperationQueue mainQueue]];
  }
}

- (NSURLSessionConfiguration*) sessionConfiguration
{
  return [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier:[NSString stringWithFormat:@"%@-%@", DOWNLOAD_IDENTIFIER, _assetKey]];
}

- (void) startDownload
{
  if (!_downloadSession || _status > Errored || !_asset || _downloadTask)
  {
    return;
  }
  
  _localFileLocation = [[NSURL fileURLWithPath:NSTemporaryDirectory()] URLByAppendingPathComponent:_assetKey];
  
  
  _downloadTask = [_downloadSession assetDownloadTaskWithURLAsset:_asset
                                                       assetTitle:_assetKey
                                                 assetArtworkData:nil
                                                          options:@{
                                                                    AVAssetDownloadTaskMinimumRequiredMediaBitrateKey: @(0),
                                                                    }];
  [_downloadTask resume];
  _status = Downloading;
}

- (void) stopDownload
{
  [_downloadTask cancel];
  _downloadTask = nil;

  if (status == Downloading)
  {
    _status = Paused;
  }
}

- (void)URLSession:(NSURLSession *)session assetDownloadTask:(AVAssetDownloadTask *)assetDownloadTask didResolveMediaSelection:(AVMediaSelection *)resolvedMediaSelection
{
  NSLog(@"Download resolved");
}

- (void) URLSession:(NSURLSession*)session assetDownloadTask:(AVAssetDownloadTask*)assetDownloadTask didFinishDownloadingToURL:(NSURL*)location
{
  NSLog(@"Download finished");
}

- (void) URLSession:(NSURLSession*)session task:(NSURLSessionTask*)task didCompleteWithError:(nullable NSError*)error
{
  if (error)
  {
    NSLog(@"Downloading video to cache failed because %@", error);
    _status = Errored;
    _error = error;
    return;
  }
  
  if (_finishedDownloadBlock)
  {
    _finishedDownloadBlock(_localFileLocation, self);
  }
  
  _downloadTask = nil;
  _status = Finished;
  _finishedDownloadBlock = nil;
}

@end
