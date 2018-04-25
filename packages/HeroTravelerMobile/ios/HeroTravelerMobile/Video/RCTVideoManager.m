#import "RCTVideoManager.h"
#import "RCTVideo.h"
#import <React/RCTBridge.h>
#import <AVFoundation/AVFoundation.h>

@implementation RCTVideoManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view
{
  return [[RCTVideo alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(getWidthAndHeight:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  NSNumber* heightObj = [data objectForKey:@"height"];
  NSNumber* widthObj = [data objectForKey:@"width"];
  
  if ([widthObj isKindOfClass:[NSNumber class]] && [heightObj isKindOfClass:[NSNumber class]])
  {
    resolve(@{@"width": widthObj, @"height": heightObj});
    return;
  }
  
  NSString* uriString = [data objectForKey:@"uri"];
  if (uriString.length <= 0)
  {
    reject(RCTErrorDomain, @"No file URI in request data", [NSError errorWithDomain:RCTErrorDomain code:1000 userInfo:@{}]);
    return;
  }
  NSURL* uri = [uriString isKindOfClass:[NSURL class]] ? (NSURL*)uriString : [NSURL URLWithString:uriString];
  if (!uri)
  {
    reject(RCTErrorDomain, @"No file URI in request data", [NSError errorWithDomain:RCTErrorDomain code:1000 userInfo:@{}]);
    return;
  }
  AVURLAsset* asset = [AVURLAsset URLAssetWithURL:uri options:nil];
  NSArray* tracks = [asset tracksWithMediaType:AVMediaTypeVideo];
  if (tracks.count <= 0)
  {
    reject(RCTErrorDomain, @"Could not get width and height from file", [NSError errorWithDomain:RCTErrorDomain code:1000 userInfo:@{}]);
    return;
  }
  
  AVAssetTrack* track = [tracks objectAtIndex:0];
  CGSize size = track.naturalSize;
  resolve(@{@"width": @(size.width), @"height": @(size.height)});
}

RCT_EXPORT_VIEW_PROPERTY(src, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(resizeMode, NSString);
RCT_EXPORT_VIEW_PROPERTY(needsVideoLoaded, BOOL);
RCT_EXPORT_VIEW_PROPERTY(repeat, BOOL);
RCT_EXPORT_VIEW_PROPERTY(paused, BOOL);
RCT_EXPORT_VIEW_PROPERTY(muted, BOOL);
RCT_EXPORT_VIEW_PROPERTY(volume, float);
RCT_EXPORT_VIEW_PROPERTY(playInBackground, BOOL);
RCT_EXPORT_VIEW_PROPERTY(playWhenInactive, BOOL);
RCT_EXPORT_VIEW_PROPERTY(ignoreSilentSwitch, NSString);
RCT_EXPORT_VIEW_PROPERTY(rate, float);
RCT_EXPORT_VIEW_PROPERTY(fullscreen, BOOL);
RCT_EXPORT_VIEW_PROPERTY(showControls, BOOL)

RCT_EXPORT_VIEW_PROPERTY(onVideoLoad, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoBuffer, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoError, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoEnd, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onTimedMetadata, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoFullscreenPlayerWillPresent, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoFullscreenPlayerDidPresent, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoFullscreenPlayerWillDismiss, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoFullscreenPlayerDidDismiss, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onReadyForDisplay, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPlaybackStalled, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPlaybackResume, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPlaybackRateChange, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPauseFromUI, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPlayFromUI, RCTBubblingEventBlock);

- (NSDictionary *)constantsToExport
{
  return @{
    @"ScaleNone": AVLayerVideoGravityResizeAspect,
    @"ScaleToFill": AVLayerVideoGravityResize,
    @"ScaleAspectFit": AVLayerVideoGravityResizeAspect,
    @"ScaleAspectFill": AVLayerVideoGravityResizeAspectFill
  };
}

@end
