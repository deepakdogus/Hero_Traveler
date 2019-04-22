//
//  VideoDownloadItem.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DownloadSessionManager.h"

@protocol DownloadItemDelegate

- (void) asset:(NSString*)assetKey finishedAtLocation:(NSURL*)localFileUrl;

@end

typedef enum DownloadStatus {
  Pending = 0,
  Paused,
  CancelPendingPaused,
  CancelPendingDownload,
  Errored,
  Downloading,
  Finished,
  Invalid,
} DownloadStatus;

@interface VideoDownloadItem : NSObject <NSURLSessionDownloadDelegate>

- (instancetype) initWithAssetKey:(NSString*)assetKey downloadUrl:(NSURL*)url;

@property(weak) id<DownloadItemDelegate> delegate;

@property(readonly, strong) NSString* assetKey;
@property(readonly, strong) NSURL* downloadUrl;

@property(readonly) DownloadStatus status;
@property(readonly, strong) NSError* error;
@property(readonly, strong) NSData* resumeData;

- (void) invalidate;
- (void) startDownload;
- (void) stopDownload;

@property(readonly, strong) NSURLSessionDownloadTask* downloadTask;

@end

