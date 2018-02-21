//
//  VideoDownloadItem.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum DownloadStatus {
  Pending = 0,
  Paused,
  Errored,
  Downloading,
  Finished,
} DownloadStatus;

@interface VideoDownloadItem : NSObject <AVAssetDownloadDelegate>

- (instancetype) initWithAssetKey:(NSString*)assetKey downloadUrl:(NSString*)url;

@property(readonly, strong) AVURLAsset* asset;
@property(readonly, strong) NSString* assetKey;

@property(readonly) DownloadStatus status;
@property(readonly, strong) NSError* error;

- (void) startDownload;
- (void) stopDownload;

@property(readonly, strong) AVAssetDownloadURLSession* downloadSession;

@property(readonly, strong) AVAssetDownloadTask* downloadTask;
@property(readonly, strong) NSURL* localFileLocation;


@property(readonly, strong) FinishedDownloadBlock finishedDownloadBlock;

@end
