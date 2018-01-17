//
//  VideoCacheItem.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 1/14/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "VideoCacheItem.h"
#import "RCTVideo.h"
#import <React/UIView+React.h>

static NSString *const statusKeyPath = @"status";
static NSString *const playbackLikelyToKeepUpKeyPath = @"playbackLikelyToKeepUp";
static NSString *const playbackBufferEmptyKeyPath = @"playbackBufferEmpty";
static NSString *const playbackRate = @"rate";
static NSString *const timedMetadata = @"timedMetadata";

typedef RCTBubblingEventBlock (^ExtractEvent)(RCTVideo*);

@implementation VideoCacheItem

- (instancetype) initWithAssetKey:(NSString*)assetKey uri:(NSString*)uri finishedDownloadBlock:(FinishedDownloadBlock)finishedDownloadBlock
{
  if (self = [super init])
  {
    _assetKey = assetKey;
    _needsDownload = YES;
    
    currentPlayingVideoItems = @[];
    
    NSURL* url = [NSURL URLWithString:uri];
    NSArray *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
    _asset = [AVURLAsset URLAssetWithURL:url options:@{AVURLAssetHTTPCookiesKey : cookies}];
    _playerItem = [AVPlayerItem playerItemWithAsset:_asset];
    [self addPlayerItemObservers];
    _player = [AVPlayer playerWithPlayerItem:_playerItem];
    _player.actionAtItemEnd = AVPlayerActionAtItemEndNone;
    [self addPlayerObservers];
    
//    NSURLSessionConfiguration* sessionConfiguration = [self sessionConfiguration];
//    _downloadSession = [AVAssetDownloadURLSession
//                        sessionWithConfiguration:sessionConfiguration
//                        assetDownloadDelegate:self
//                        delegateQueue:[NSOperationQueue mainQueue]];
    
  }
  
  return self;
}

- (instancetype) initWithAssetKey:(NSString*)assetKey cachedLocation:(NSURL*)url
{
  if (self = [super init])
  {
    _assetKey = assetKey;
    _needsDownload = NO;
    
    _playerItem = [AVPlayerItem playerItemWithURL:url];
    _player = [AVPlayer playerWithPlayerItem:_playerItem];
    _player.actionAtItemEnd = AVPlayerActionAtItemEndNone;
  }
  
  return self;
}

- (NSURLSessionConfiguration*) sessionConfiguration
{
  return [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier:[NSString stringWithFormat:@"%@-%@", DOWNLOAD_IDENTIFIER, _assetKey]];
}

- (void) startDownload
{
  if (!_downloadSession || !_needsDownload || !_asset || _downloadTask)
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
}

- (void) stopDownload
{
  if (!_downloadTask)
  {
    return;
  }
  
  [_downloadTask cancel];
  _downloadTask = nil;
}

- (void) touch
{
  _lastTouched = [NSDate date];
}

- (NSInteger) numPlayingInstances
{
  NSMutableArray* mCurrentPlayingVideoItems = [@[] mutableCopy];
  for (WeakPlayingVideoItem* weakPlayingVideoItem in currentPlayingVideoItems)
  {
    if (weakPlayingVideoItem.playingVideoItem && weakPlayingVideoItem.playingVideoItem.videoView)
    {
      [mCurrentPlayingVideoItems addObject:weakPlayingVideoItem];
    }
  }
  
  currentPlayingVideoItems = [NSArray arrayWithArray:mCurrentPlayingVideoItems];
  return currentPlayingVideoItems.count;
}

- (void) injectAndSendDict:(RCTBubblingEventBlock)event view:(UIView*)view info:(NSDictionary*)info
{
  if (!event || !view)
  {
    return;
  }

  NSMutableDictionary* mInfo = [info mutableCopy];
  [mInfo setObject:view.reactTag forKey:@"target"];
  event([NSDictionary dictionaryWithDictionary:mInfo]);
}

- (void) sendToAllViews:(ExtractEvent)eventBlock info:(NSDictionary*)info
{
  for (WeakPlayingVideoItem* weakPlayingVideoItem in currentPlayingVideoItems)
  {
    RCTVideo* videoView = weakPlayingVideoItem.playingVideoItem.videoView;
    if (videoView)
    {
      [self injectAndSendDict:eventBlock(videoView) view:videoView info:info];
    }
  }
}

- (void) addReference:(PlayingVideoItem*)playingVideoItem
{
  NSMutableArray* mCurrentPlayingVideoItems = [@[] mutableCopy];
  for (WeakPlayingVideoItem* weakPlayingVideoItem in currentPlayingVideoItems)
  {
    if (weakPlayingVideoItem.playingVideoItem && weakPlayingVideoItem.playingVideoItem.videoView)
    {
      [mCurrentPlayingVideoItems addObject:weakPlayingVideoItem];
    }
  }
  
  [mCurrentPlayingVideoItems addObject:[[WeakPlayingVideoItem alloc] initWithPlayingVideoItem:playingVideoItem]];
  currentPlayingVideoItems = [NSArray arrayWithArray:mCurrentPlayingVideoItems];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    BOOL foundPlayer = NO;
    
    for (WeakPlayingVideoItem* weakPlayingVideoItem in currentPlayingVideoItems)
    {
      if (weakPlayingVideoItem.playingVideoItem == playingVideoItem)
      {
        foundPlayer = YES;
        break;
      }
    }
    
    if (!foundPlayer)
    {
      return;
    }
    
    RCTVideo* videoView = playingVideoItem.videoView;
    if (isVideoLoaded && loadedInfo)
    {
      [self injectAndSendDict:videoView.onVideoLoad view:videoView info:loadedInfo];
    }
    
    if (isPlaybackStalled)
    {
      [self injectAndSendDict:videoView.onPlaybackStalled view:videoView info:@{}];
    }
    
    if (isBuffering)
    {
      [self injectAndSendDict:videoView.onVideoBuffer view:videoView info:@{@"isBuffering": @(YES)}];
    }
    
    if (errorDict)
    {
      [self injectAndSendDict:videoView.onVideoError view:videoView info:errorDict];
    }
  });
}

- (void) removeReference:(PlayingVideoItem*)playingVideoItem
{
  NSMutableArray* mCurrentPlayingVideoItems = [@[] mutableCopy];
  for (WeakPlayingVideoItem* weakPlayingVideoItem in currentPlayingVideoItems)
  {
    if (weakPlayingVideoItem.playingVideoItem && weakPlayingVideoItem.playingVideoItem.videoView && weakPlayingVideoItem.playingVideoItem != playingVideoItem)
    {
      [mCurrentPlayingVideoItems addObject:weakPlayingVideoItem];
    }
  }

  currentPlayingVideoItems = [NSArray arrayWithArray:mCurrentPlayingVideoItems];
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
    _needsDownload = NO;
    return;
  }
  
  if (_finishedDownloadBlock)
  {
    _finishedDownloadBlock(_localFileLocation, self);
  }
  
  _downloadTask = nil;
  _needsDownload = NO;
  _finishedDownloadBlock = nil;
}

- (BOOL) isViewVisible:(UIView*)view
{
  if (view.hidden)
  {
    return NO;
  }
  else if (view.superview)
  {
    return [self isViewVisible:view.superview];
  }
  return YES;
}

- (PlayingVideoItem*) getControllingVideoView
{
  NSMutableArray* visiblePlayers = [@[] mutableCopy];
  
  for (WeakPlayingVideoItem* weakPlayingVideoItem in currentPlayingVideoItems)
  {
    PlayingVideoItem* playingVidoItem = weakPlayingVideoItem.playingVideoItem;

    if ([self isViewVisible:playingVidoItem.videoView])
    {
      [visiblePlayers addObject:playingVidoItem];
    }
  }
  
  [visiblePlayers sortUsingComparator:^(PlayingVideoItem* a, PlayingVideoItem* b)
   {
     NSMutableArray* aOrder = [@[] mutableCopy];
     UIView* view = a.videoView;
     while (view) {
       if (view.superview)
       {
         [aOrder insertObject:@([view.superview.subviews indexOfObject:view]) atIndex:0];
       }
       
       view = view.superview;
     }
     
     NSMutableArray* bOrder = [@[] mutableCopy];
     view = b.videoView;
     while (view) {
       if (view.superview)
       {
         [bOrder insertObject:@([view.superview.subviews indexOfObject:view]) atIndex:0];
       }
       
       view = view.superview;
     }
     
     NSUInteger minLength = MIN(aOrder.count, bOrder.count);
     
     for (NSUInteger i=0; i<minLength; i++)
     {
       NSUInteger aPos = [[aOrder objectAtIndex:i] unsignedIntegerValue];
       NSUInteger bPos = [[bOrder objectAtIndex:i] unsignedIntegerValue];
       
       if (aPos > bPos)
       {
         return NSOrderedAscending;
       }
       if (aPos < bPos)
       {
         return NSOrderedDescending;
       }
     }
     
     if (aOrder.count > bOrder.count)
     {
       return NSOrderedAscending;
     }
     if (aOrder.count < bOrder.count)
     {
       return NSOrderedDescending;
     }
     
     return NSOrderedSame;
   }];
  
  
  return visiblePlayers.count > 0 ? [visiblePlayers objectAtIndex:0] : nil;
}

- (void) applyModifiers
{
  if (pendingItemApplyModifiers)
  {
    return;
  }
  
  pendingItemApplyModifiers = YES;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    pendingItemApplyModifiers = NO;
    if (!isVideoLoaded)
    {
      return;
    }
    
    for (WeakPlayingVideoItem* weakPlayingVideoItem in currentPlayingVideoItems)
    {
      [weakPlayingVideoItem.playingVideoItem.videoView displayWithPlayer:_player playerItem:_playerItem];
    }
    
    PlayingVideoItem* controllingPlayer = [self getControllingVideoView];
    
    if (controllingPlayer)
    {
      [controllingPlayer.videoView applyModifiersOnPlayer:_player playerItem:_playerItem];
    }
    else
    {
      [_player pause];
      [_player setRate:0.0];
    }
  });
}

- (void) dealloc
{
  [self removeListeners];
  [self removePlayerObservers];
  [self removePlayerItemObservers];
}

- (void) addPlayerItemObservers
{
  if (_playerItem)
  {
    [_playerItem addObserver:self forKeyPath:statusKeyPath options:0 context:nil];
    [_playerItem addObserver:self forKeyPath:playbackBufferEmptyKeyPath options:0 context:nil];
    [_playerItem addObserver:self forKeyPath:playbackLikelyToKeepUpKeyPath options:0 context:nil];
    [_playerItem addObserver:self forKeyPath:timedMetadata options:NSKeyValueObservingOptionNew context:nil];
    _playerItemObserversSet = YES;
  }
}

- (void) removePlayerItemObservers
{
  if (_playerItemObserversSet) {
    [_playerItem removeObserver:self forKeyPath:statusKeyPath];
    [_playerItem removeObserver:self forKeyPath:playbackBufferEmptyKeyPath];
    [_playerItem removeObserver:self forKeyPath:playbackLikelyToKeepUpKeyPath];
    [_playerItem removeObserver:self forKeyPath:timedMetadata];
    _playerItemObserversSet = NO;
  }
}

- (void) addPlayerObservers
{
  if (_player)
  {
    [_player addObserver:self forKeyPath:playbackRate options:0 context:nil];
    _playerObserversSet = YES;
  }
}

- (void) removePlayerObservers
{
  if (_playerObserversSet) {
    [_player removeObserver:self forKeyPath:playbackRate];
    _playerObserversSet = NO;
  }
}

- (void)attachListeners
{
  // listen for end of file
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(playerItemDidReachEnd:)
                                               name:AVPlayerItemDidPlayToEndTimeNotification
                                             object:[_player currentItem]];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(playbackStalled:)
                                               name:AVPlayerItemPlaybackStalledNotification
                                             object:nil];
}

- (void) playbackStalled:(NSNotification*)notification
{
  isPlaybackStalled = YES;
  [self sendToAllViews:^(RCTVideo* videoView){return videoView.onPlaybackStalled;} info:@{}];
}

- (void) playerItemDidReachEnd:(NSNotification*)notification
{
  [self sendToAllViews:^(RCTVideo* videoView){return videoView.onVideoEnd;} info:@{}];

  PlayingVideoItem* controllingPlayer  = [self getControllingVideoView];
  
  if ([controllingPlayer.videoView shouldRepeat])
  {
    AVPlayerItem *item = [notification object];
    [item seekToTime:kCMTimeZero];
    [self applyModifiers];
  }
}

- (void) removeListeners
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
  if (object == _playerItem) {
    // When timeMetadata is read the event onTimedMetadata is triggered
    if ([keyPath isEqualToString: timedMetadata])
    {
      
      
      NSArray<AVMetadataItem *> *items = [change objectForKey:@"new"];
      if (items && ![items isEqual:[NSNull null]] && items.count > 0) {
        
        NSMutableArray *array = [NSMutableArray new];
        for (AVMetadataItem* item in items) {
          
          NSString* value = (NSString*) item.value;
          NSString* identifier = item.identifier;
          
          if (![value isEqual: [NSNull null]]) {
            NSDictionary *dictionary = [[NSDictionary alloc] initWithObjects:@[value, identifier] forKeys:@[@"value", @"identifier"]];
            
            [array addObject:dictionary];
          }
        }
        
        [self sendToAllViews:^(RCTVideo* videoView){return videoView.onTimedMetadata;} info:@{@"metadata": array}];
      }
    }
    
    if ([keyPath isEqualToString:statusKeyPath]) {
      // Handle player item status change.
      errorDict = nil;

      if (_playerItem.status == AVPlayerItemStatusReadyToPlay) {
        float duration = CMTimeGetSeconds(_playerItem.asset.duration);
        
        if (isnan(duration)) {
          duration = 0.0;
        }
        
        NSObject *width = @"undefined";
        NSObject *height = @"undefined";
        NSString *orientation = @"undefined";
        
        if ([_playerItem.asset tracksWithMediaType:AVMediaTypeVideo].count > 0) {
          AVAssetTrack *videoTrack = [[_playerItem.asset tracksWithMediaType:AVMediaTypeVideo] objectAtIndex:0];
          width = [NSNumber numberWithFloat:videoTrack.naturalSize.width];
          height = [NSNumber numberWithFloat:videoTrack.naturalSize.height];
          CGAffineTransform preferredTransform = [videoTrack preferredTransform];
          
          if ((videoTrack.naturalSize.width == preferredTransform.tx
               && videoTrack.naturalSize.height == preferredTransform.ty)
              || (preferredTransform.tx == 0 && preferredTransform.ty == 0))
          {
            orientation = @"landscape";
          } else
            orientation = @"portrait";
        }
        
        loadedInfo = @{@"duration": [NSNumber numberWithFloat:duration],
                       @"currentTime": [NSNumber numberWithFloat:CMTimeGetSeconds(_playerItem.currentTime)],
                       @"canPlayReverse": [NSNumber numberWithBool:_playerItem.canPlayReverse],
                       @"canPlayFastForward": [NSNumber numberWithBool:_playerItem.canPlayFastForward],
                       @"canPlaySlowForward": [NSNumber numberWithBool:_playerItem.canPlaySlowForward],
                       @"canPlaySlowReverse": [NSNumber numberWithBool:_playerItem.canPlaySlowReverse],
                       @"canStepBackward": [NSNumber numberWithBool:_playerItem.canStepBackward],
                       @"canStepForward": [NSNumber numberWithBool:_playerItem.canStepForward],
                       @"naturalSize": @{
                           @"width": width,
                           @"height": height,
                           @"orientation": orientation
                           },
                       };
        [self sendToAllViews:^(RCTVideo* videoView){return videoView.onVideoLoad;} info:loadedInfo];
        
        isVideoLoaded = YES;
        
        [self attachListeners];
        [self applyModifiers];
      } else if (_playerItem.status == AVPlayerItemStatusFailed) {
        NSError* videoError = _playerItem.error;
        if (videoError && videoError.domain)
        {
          errorDict = @{
                        @"code": @(videoError.code),
                        @"domain": videoError.domain,
                        };
          
          [self sendToAllViews:^(RCTVideo* videoView){return videoView.onVideoError;} info:errorDict];
        }
      }
    } else if ([keyPath isEqualToString:playbackBufferEmptyKeyPath]) {
      isBuffering = YES;
      [self sendToAllViews:^(RCTVideo* videoView){return videoView.onVideoBuffer;} info:@{@"isBuffering": @(YES)}];
    } else if ([keyPath isEqualToString:playbackLikelyToKeepUpKeyPath]) {
      isBuffering = NO;
      [self sendToAllViews:^(RCTVideo* videoView){return videoView.onVideoBuffer;} info:@{@"isBuffering": @(NO)}];
      [self applyModifiers];
    }
  } else if (object == _player) {
    if([keyPath isEqualToString:playbackRate]) {
      [self sendToAllViews:^(RCTVideo* videoView){return videoView.onPlaybackRateChange;} info:@{@"playbackRate": @(_player.rate)}];

      if (isPlaybackStalled && _player.rate > 0)
      {
        [self sendToAllViews:^(RCTVideo* videoView){return videoView.onPlaybackResume;} info:@{@"playbackRate": @(_player.rate)}];
        isPlaybackStalled = NO;
      }
    }
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

@end

@implementation PlayingVideoItem

- (AVPlayerItem*) playerItem
{
  return videoCacheItem.playerItem;
}

- (AVPlayer*) player
{
  return videoCacheItem.player;
}

- (instancetype) initWithVideoCacheItem:(VideoCacheItem*)videoCacheItem_ videoView:(RCTVideo*)videoView_
{
  if (self = [super init])
  {
    videoCacheItem = videoCacheItem_;
    _videoView = videoView_;
    [videoCacheItem addReference:self];
  }
  
  return self;
}

- (void) dealloc
{
  [videoCacheItem removeReference:self];
}

- (void) requestApplyModifiers
{
  [videoCacheItem applyModifiers];
}

- (void)URLSession:(NSURLSession *)session assetDownloadTask:(AVAssetDownloadTask *)assetDownloadTask didLoadTimeRange:(CMTimeRange)timeRange totalTimeRangesLoaded:(NSArray<NSValue *> *)loadedTimeRanges timeRangeExpectedToLoad:(CMTimeRange)timeRangeExpectedToLoad
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session aggregateAssetDownloadTask:(AVAggregateAssetDownloadTask *)aggregateAssetDownloadTask willDownloadToURL:(NSURL *)location
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session aggregateAssetDownloadTask:(AVAggregateAssetDownloadTask *)aggregateAssetDownloadTask didCompleteForMediaSelection:(AVMediaSelection *)mediaSelection
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session aggregateAssetDownloadTask:(AVAggregateAssetDownloadTask *)aggregateAssetDownloadTask didLoadTimeRange:(CMTimeRange)timeRange totalTimeRangesLoaded:(NSArray<NSValue *> *)loadedTimeRanges timeRangeExpectedToLoad:(CMTimeRange)timeRangeExpectedToLoad forMediaSelection:(AVMediaSelection *)mediaSelection
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
willBeginDelayedRequest:(NSURLRequest *)request
 completionHandler:(void (^)(NSURLSessionDelayedRequestDisposition disposition, NSURLRequest * _Nullable newRequest))completionHandler
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session taskIsWaitingForConnectivity:(NSURLSessionTask *)task
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
willPerformHTTPRedirection:(NSHTTPURLResponse *)response
        newRequest:(NSURLRequest *)request
 completionHandler:(void (^)(NSURLRequest * _Nullable))completionHandler
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge
 completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential * _Nullable credential))completionHandler
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
 needNewBodyStream:(void (^)(NSInputStream * _Nullable bodyStream))completionHandler
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
   didSendBodyData:(int64_t)bytesSent
    totalBytesSent:(int64_t)totalBytesSent
totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend
{
  NSLog(@"A");
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didFinishCollectingMetrics:(NSURLSessionTaskMetrics *)metrics
{
  NSLog(@"A");
}

@end

@implementation WeakPlayingVideoItem

- (instancetype) initWithPlayingVideoItem:(PlayingVideoItem*)playingVideoItem
{
  if (self = [super init])
  {
    _playingVideoItem = playingVideoItem;
  }
  return self;
}

@end
