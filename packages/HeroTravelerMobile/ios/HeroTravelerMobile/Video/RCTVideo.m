#import <React/RCTConvert.h>
#import "RCTVideo.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>
#import "RCTVideoCache.h"

static NSString *const readyForDisplayKeyPath = @"readyForDisplay";

@implementation RCTVideo
{
  BOOL _playerBufferEmpty;
  AVPlayerLayer *_playerLayer;
  AVPlayerViewController *_playerViewController;
  NSURL *_videoURL;
  PlayingVideoItem* playingVideoItem;

  /* Required to publish events */
  RCTEventDispatcher *_eventDispatcher;

  BOOL _showPlayer;
  BOOL _fullscreen;
  UIViewController * _presentingViewController;

  /* Keep track of any modifiers, need to be applied after each play */
  float _volume;
  float _rate;
  BOOL _muted;
  BOOL _paused;
  BOOL _repeat;
  BOOL _playInBackground;
  BOOL _playWhenInactive;
  NSString * _ignoreSilentSwitch;
  NSString * _resizeMode;
  
  BOOL _isInBackground;
  BOOL _isResigningActive;
  
  NSString* _uri;
}

- (instancetype) initWithEventDispatcher:(RCTEventDispatcher*)eventDispatcher
{
  if ((self = [super init]))
  {
    _eventDispatcher = eventDispatcher;

    _showPlayer = YES;
    _fullscreen = NO;
    _rate = 1.0;
    _volume = 1.0;
    _resizeMode = @"AVLayerVideoGravityResizeAspectFill";
    _playerBufferEmpty = YES;
    _playInBackground = false;
    _playWhenInactive = false;
    _ignoreSilentSwitch = @"inherit"; // inherit, ignore, obey
    _isInBackground = NO;

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationWillResignActive:)
                                                 name:UIApplicationWillResignActiveNotification
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationDidEnterBackground:)
                                                 name:UIApplicationDidEnterBackgroundNotification
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationWillEnterForeground:)
                                                 name:UIApplicationWillEnterForegroundNotification
                                               object:nil];
  }

  return self;
}

/* ---------------------------------------------------------
 **  Get the duration for a AVPlayerItem.
 ** ------------------------------------------------------- */

#pragma mark - Progress

- (void) dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  _showPlayer = NO;
  [self removeAllPlayerViews];
  playingVideoItem = nil;
}

#pragma mark - App lifecycle handlers

- (void) applicationWillResignActive:(NSNotification*)notification
{
  _isResigningActive = YES;
  [self applyModifiers];
}

- (void) applicationDidEnterBackground:(NSNotification*)notification
{
  _isInBackground = YES;
  [self applyModifiers];
}

- (void) applicationWillEnterForeground:(NSNotification*)notification
{
  _isResigningActive = NO;
  _isInBackground = NO;
  [self applyModifiers];
}

- (void) removeAllPlayerViews
{
  if (_playerLayer)
  {
    [_playerLayer removeFromSuperlayer];
    [_playerLayer removeObserver:self forKeyPath:readyForDisplayKeyPath];
    _playerLayer = nil;
  }
  
  if (_playerViewController)
  {
    [self videoPlayerViewControllerWillDismiss:_playerViewController];
    AVPlayerViewController* playerViewController = _playerViewController;
    [_presentingViewController dismissViewControllerAnimated:true completion:^{
      [self videoPlayerViewControllerDidDismiss:playerViewController];
    }];
    _playerViewController = nil;
    _presentingViewController = nil;
  }
}


#pragma mark - Player and source

- (void) setSrc:(NSDictionary*)source
{
  NSString* uri = [source objectForKey:@"uri"];
  
  _uri = uri;
  
  [self removeAllPlayerViews];
  if (_uri.length == 0)
  {
    playingVideoItem = nil;
  }
  else
  {
    playingVideoItem = [[RCTVideoCache get] assetForUrl:uri forVideoView:self];
  }
  [self applyModifiers];
}

- (void) purgePlayingVideo
{
  playingVideoItem = nil;
}

- (void) restorePlayingVideo
{
  if (playingVideoItem || _uri.length == 0)
  {
    return;
  }
  
  playingVideoItem = [[RCTVideoCache get] assetForUrl:_uri forVideoView:self];
}

#pragma mark - Prop setters

- (void) setResizeMode:(NSString*)mode
{
  _playerLayer.videoGravity = mode;
  _resizeMode = mode;
}

- (void) setPlayInBackground:(BOOL)playInBackground
{
  _playInBackground = playInBackground;
}

- (void) setPlayWhenInactive:(BOOL)playWhenInactive
{
  _playWhenInactive = playWhenInactive;
}

- (void) setIgnoreSilentSwitch:(NSString*)ignoreSilentSwitch
{
  _ignoreSilentSwitch = ignoreSilentSwitch;
  [self applyModifiers];
}

- (void) setPaused:(BOOL)paused
{
  _paused = paused;
  [self applyModifiers];
}

- (void) setRate:(float)rate
{
  _rate = rate;
  [self applyModifiers];
}

- (void) setMuted:(BOOL)muted
{
  _muted = muted;
  [self applyModifiers];
}

- (void) setVolume:(float)volume
{
  _volume = volume;
  [self applyModifiers];
}

- (void) applyModifiers
{
  [playingVideoItem requestApplyModifiers];
}

- (void) setRepeat:(BOOL)repeat
{
  _repeat = repeat;
}

- (BOOL) shouldRepeat
{
  return _repeat;
}

- (BOOL) getFullscreen
{
    return _fullscreen;
}

- (void) setFullscreen:(BOOL)fullscreen
{
  _fullscreen = fullscreen;
  [self applyModifiers];
}

#pragma mark - RCTVideoPlayerViewControllerDelegate

- (void) videoPlayerViewControllerWillDismiss:(AVPlayerViewController*)playerViewController
{
  if (self.onVideoFullscreenPlayerWillDismiss)
  {
    self.onVideoFullscreenPlayerWillDismiss(@{@"target": self.reactTag});
  }
}

- (void) videoPlayerViewControllerDidDismiss:(AVPlayerViewController*)playerViewController
{
  if (self.onVideoFullscreenPlayerDidDismiss)
  {
    self.onVideoFullscreenPlayerDidDismiss(@{@"target": self.reactTag});
  }
}

- (void) layoutSubviews
{
  [super layoutSubviews];
  [self restorePlayingVideo];
  [CATransaction begin];
  [CATransaction setAnimationDuration:0];
  _playerLayer.frame = self.bounds;
  [CATransaction commit];
}

- (void) didMoveToWindow
{
  [super didMoveToWindow];
  if (self.window)
  {
    [self restorePlayingVideo];
  }
}

- (void) didMoveToSuperview
{
  if (self.superview)
  {
    _showPlayer = YES;
    [self restorePlayingVideo];
    [self applyModifiers];
  }

  [super didMoveToSuperview];
}

#pragma mark - Lifecycle

- (void) removeFromSuperview
{
  _showPlayer = NO;
  [self applyModifiers];

  _eventDispatcher = nil;
  [[NSNotificationCenter defaultCenter] removeObserver:self];

  playingVideoItem = nil;

  [super removeFromSuperview];
}

- (void) displayWithPlayer:(AVPlayer*)player playerItem:(AVPlayerItem*)playerItem
{
  BOOL playerLayerVisible = _showPlayer;
  BOOL fullscreenVisible = _showPlayer && _fullscreen;
  
  [player pause];
  [player setRate:0.f];
  
  if (playerLayerVisible && !_playerLayer)
  {
    _playerLayer = [AVPlayerLayer playerLayerWithPlayer:player];
    _playerLayer.frame = self.bounds;
    _playerLayer.needsDisplayOnBoundsChange = YES;
    
    // to prevent video from being animated when resizeMode is 'cover'
    // resize mode must be set before layer is added
    [self setResizeMode:_resizeMode];
    [_playerLayer addObserver:self forKeyPath:readyForDisplayKeyPath options:NSKeyValueObservingOptionNew context:nil];
    
    if (_playerLayer.readyForDisplay)
    {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (self.onReadyForDisplay)
        {
          self.onReadyForDisplay(@{@"target": self.reactTag});
        }
      });
    }
    
    [self.layer addSublayer:_playerLayer];
    self.layer.needsDisplayOnBoundsChange = YES;
  }
  else if (!playerLayerVisible && _playerLayer)
  {
    [_playerLayer removeFromSuperlayer];
    [_playerLayer removeObserver:self forKeyPath:readyForDisplayKeyPath];
    _playerLayer = nil;
  }
  
  if (fullscreenVisible && !_playerViewController)
  {
    RCTVideoPlayerViewController* playerLayer = [[RCTVideoPlayerViewController alloc] init];
    playerLayer.showsPlaybackControls = NO;
    playerLayer.rctDelegate = self;
    playerLayer.view.frame = self.bounds;
    playerLayer.player = player;
    playerLayer.view.frame = self.bounds;
    
    _playerViewController = playerLayer;
    // to prevent video from being animated when resizeMode is 'cover'
    // resize mode must be set before subview is added
    [self setResizeMode:_resizeMode];
    [self addSubview:_playerViewController.view];
    
    // Set presentation style to fullscreen
    [_playerViewController setModalPresentationStyle:UIModalPresentationFullScreen];
    
    // Find the nearest view controller
    UIViewController* viewController = [self firstAvailableUIViewController];
    if (!viewController)
    {
      UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
      viewController = keyWindow.rootViewController;
      if( viewController.childViewControllers.count > 0 )
      {
        viewController = viewController.childViewControllers.lastObject;
      }
    }
    
    if (viewController)
    {
      _presentingViewController = viewController;
      if(self.onVideoFullscreenPlayerWillPresent) {
        self.onVideoFullscreenPlayerWillPresent(@{@"target": self.reactTag});
      }
      [viewController presentViewController:_playerViewController animated:true completion:^{
        _playerViewController.showsPlaybackControls = YES;
        if(self.onVideoFullscreenPlayerDidPresent) {
          self.onVideoFullscreenPlayerDidPresent(@{@"target": self.reactTag});
        }
      }];
    }
  }
  else if (!fullscreenVisible && _playerViewController)
  {
    [self videoPlayerViewControllerWillDismiss:_playerViewController];
    AVPlayerViewController* playerViewController = _playerViewController;
    [_presentingViewController dismissViewControllerAnimated:true completion:^{
      [self videoPlayerViewControllerDidDismiss:playerViewController];
    }];
    _playerViewController = nil;
    _presentingViewController = nil;
  }
}

- (void) applyModifiersOnPlayer:(AVPlayer*)player playerItem:(AVPlayerItem*)playerItem
{
  if ((_isResigningActive && !_playInBackground && !_playWhenInactive) || _paused)
  {
    [player pause];
    [player setRate:0.0];
  }
  else
  {
    if ([_ignoreSilentSwitch isEqualToString:@"ignore"])
    {
      [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
    }
    else if ([_ignoreSilentSwitch isEqualToString:@"obey"])
    {
      [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
    }
    
    [player play];
    [player setRate:_rate];
  }

  if (!_isInBackground && _playerLayer.player != player)
  {
    [_playerLayer setPlayer:player];
  }
  else if (_isInBackground && _playerLayer.player != nil)
  {
    [_playerLayer setPlayer:nil];
  }
  
  if (_muted)
  {
    [player setVolume:0];
    [player setMuted:YES];
  }
  else
  {
    [player setVolume:_volume];
    [player setMuted:NO];
  }
  
  [self setResizeMode:_resizeMode];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
  if (object == _playerLayer) {
    if([keyPath isEqualToString:readyForDisplayKeyPath] && [change objectForKey:NSKeyValueChangeNewKey]) {
      if ([change objectForKey:NSKeyValueChangeNewKey]) {
        if (self.onReadyForDisplay)
        {
          self.onReadyForDisplay(@{@"target": self.reactTag});
        }
      }
    }
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}
@end
