#import <React/RCTConvert.h>
#import "RCTVideo.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>
#import "RCTVideoCache.h"
#import "UIView+DetectHierarchyChanges.h"

static NSString *const readyForDisplayKeyPath = @"readyForDisplay";

@implementation RCTVideo
{
  BOOL _playerBufferEmpty;
  AVPlayerViewController* _embeddedViewController;
  AVPlayerViewController* _playerViewController;
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
  BOOL _showControls;

  BOOL _isInBackground;
  BOOL _isResigningActive;
  
  NSString* _uri;
  NSString* _originalUri;
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
  if (_embeddedViewController)
  {
    [_embeddedViewController.view removeFromSuperview];
    [_embeddedViewController removeFromParentViewController];
    [_embeddedViewController removeObserver:self forKeyPath:readyForDisplayKeyPath];
    [_embeddedViewController removeObserver:self forKeyPath:@"videoBounds"];
    _embeddedViewController = nil;
  }
  
  if (_playerViewController)
  {
    UIViewController* presentingViewController = _presentingViewController;
    _playerViewController = nil;
    _presentingViewController = nil;
    [presentingViewController dismissViewControllerAnimated:true completion:^{
    }];
  }
}


#pragma mark - Player and source

- (void) setSrc:(NSDictionary*)source
{
  NSString* uri = [source objectForKey:@"uri"];
  NSString* originalUri = [source objectForKey:@"originalUri"];
  
  _uri = uri;
  _originalUri = originalUri;
  
  [self removeAllPlayerViews];
  if (_uri.length == 0)
  {
    playingVideoItem = nil;
  }
  else
  {
    playingVideoItem = [[RCTVideoCache get] assetForUrl:uri withOriginalUrl:originalUri forVideoView:self];
  }
  [self applyModifiers];
}

- (void) purgePlayingVideo
{
  playingVideoItem = nil;
  if (self.onReadyForDisplay)
  {
    self.onReadyForDisplay(@{@"ready": @NO, @"target": self.reactTag});
  }
  [self removeAllPlayerViews];
}

- (BOOL) isViewVisible:(UIView*)view
{
  if (view.hidden || view.alpha <= 0.5f)
  {
    return NO;
  }
  else if (view.superview)
  {
    return [self isViewVisible:view.superview];
  }
  return [view isKindOfClass:[UIWindow class]];
}

- (void) restorePlayingVideo
{
  if (![self isViewVisible:self])
  {
    return;
  }
  
  if (playingVideoItem || _uri.length == 0)
  {
    return;
  }
  
  playingVideoItem = [[RCTVideoCache get] assetForUrl:_uri withOriginalUrl:_originalUri forVideoView:self];
}

#pragma mark - Prop setters

- (void) setResizeMode:(NSString*)mode
{
  _embeddedViewController.videoGravity = mode;
  _playerViewController.videoGravity = mode;
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

- (void) setIsBuffering:(BOOL)isBuffering
{
  self.hidden = isBuffering;
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

- (float) rate
{
  return _rate;
}

- (void) setMuted:(BOOL)muted
{
  _muted = muted;
  [self applyModifiers];
}

- (void) setShowControls:(BOOL)showControls
{
  _embeddedViewController.showsPlaybackControls = showControls;
  _playerViewController.showsPlaybackControls = showControls;
  _showControls = showControls;
}

- (BOOL) showControls
{
  return _showControls;
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

- (BOOL) isDisplayingFullscreen
{
  return _playerViewController != nil && _presentingViewController != nil;
}

- (void) videoPlayerViewControllerWillDismiss:(AVPlayerViewController*)playerViewController
{
  if (_fullscreen)
  {
    _playerViewController = nil;
    _presentingViewController = nil;
    
    [self setFullscreen:NO];
  }

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

- (void) hierachyChanged
{
  [self restorePlayingVideo];
}

- (void) setBounds:(CGRect)bounds
{
  [super setBounds:bounds];
  [CATransaction begin];
  [CATransaction setAnimationDuration:0];
  _embeddedViewController.view.frame = self.bounds;
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
	
  if (playerLayerVisible && !_embeddedViewController)
  {
    _embeddedViewController = [[AVPlayerViewController alloc] init];
    _embeddedViewController.view.frame = self.bounds;
    _embeddedViewController.showsPlaybackControls = _showControls;
    
    
    [self setResizeMode:_resizeMode];
    
    [_embeddedViewController addObserver:self
                              forKeyPath:readyForDisplayKeyPath
                                 options:NSKeyValueObservingOptionNew
                                 context:nil];

    [_embeddedViewController addObserver:self
															forKeyPath:@"videoBounds"
																 options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld
																 context:nil];

    if (_embeddedViewController.readyForDisplay)
    {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (self.onReadyForDisplay)
        {
          self.onReadyForDisplay(@{@"ready": @YES, @"target": self.reactTag});
        }
      });
    }
    
    [self addSubview:_embeddedViewController.view];
  }
  else if (!playerLayerVisible && _embeddedViewController)
  {
    [_embeddedViewController removeFromParentViewController];
    [_embeddedViewController.view removeFromSuperview];
    [_embeddedViewController removeObserver:self forKeyPath:readyForDisplayKeyPath];
    [_embeddedViewController removeObserver:self forKeyPath:@"videoBounds"];
    _embeddedViewController = nil;
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
    _playerViewController.showsPlaybackControls = _showControls;
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
    AVPlayerViewController* playerViewController = _playerViewController;
    UIViewController* presentingViewController = _presentingViewController;
    __weak RCTVideo* weakSelf = self;
    
    _playerViewController = nil;
    _presentingViewController = nil;
    [self videoPlayerViewControllerWillDismiss:playerViewController];
    [presentingViewController dismissViewControllerAnimated:true completion:^{
      [weakSelf videoPlayerViewControllerDidDismiss:playerViewController];
    }];
  }
}

- (void) applyModifiersOnPlayer:(AVPlayer*)player playerItem:(AVPlayerItem*)playerItem
{
  if (![self isPlaying])
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

  if (!_isInBackground && _embeddedViewController.player != player)
  {
    [_embeddedViewController setPlayer:player];
  }
  else if (_isInBackground && _embeddedViewController.player != nil)
  {
    [_embeddedViewController setPlayer:nil];
  }
  
  if (_muted)
  {
    [player setVolume:0];
    [player setMuted:YES];
  }
  else
  {
    [player setVolume:1];
    [player setMuted:NO];
  }

  [self setResizeMode:_resizeMode];
}

- (BOOL) isPlaying
{
  return !((_isResigningActive && !_playInBackground && !_playWhenInactive) || _paused);
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
  if (object == _embeddedViewController) {
    if([keyPath isEqualToString:readyForDisplayKeyPath] && [change objectForKey:NSKeyValueChangeNewKey]) {
      if ([change objectForKey:NSKeyValueChangeNewKey]) {
        if (self.onReadyForDisplay)
        {
          self.onReadyForDisplay(@{@"ready": @YES, @"target": self.reactTag});
        }
      }
		} else if([keyPath isEqualToString:@"videoBounds"] && [change objectForKey:NSKeyValueChangeNewKey]) {
			// https://stackoverflow.com/questions/26330287/how-to-detect-fullscreen-mode-of-avplayerviewcontroller/33996932
			CGRect zeroBounds = CGRectMake(0,0,0,0);
			CGRect oldBounds = [change[NSKeyValueChangeOldKey] CGRectValue], newBounds = [change[NSKeyValueChangeNewKey] CGRectValue];
			if (!CGRectEqualToRect(newBounds, zeroBounds) && !CGRectEqualToRect(oldBounds, zeroBounds)) {
				// Very, very hacky. But the AVPlayerController dispatches these events multiple times, both for
				// switching to fullscreen and changing the videoGravity. So one pattern that seemed to work was
				// the y value for the old CGRect of a restored video container is below zero, so we're testing for that.
				
				// Original check:
				// BOOL wasFullscreen = CGRectEqualToRect(oldBounds, [UIScreen mainScreen].bounds);
				BOOL wasFullscreen = oldBounds.origin.y < 0;
				BOOL isFullscreen = CGRectEqualToRect(newBounds, [UIScreen mainScreen].bounds);
				
				if (isFullscreen && !wasFullscreen) {
					NSLog(@"RCTVideo: Forcing resize mode to contain");
					_embeddedViewController.videoGravity = @"AVLayerVideoGravityResizeAspect";
				}
				else if (!isFullscreen && wasFullscreen) {
					NSLog(@"RCTVideo: Restoring resize mode");
					[self performSelector:@selector(setResizeMode:) withObject:_resizeMode afterDelay:0];
					[self setResizeMode:_resizeMode];
				}
			}
		}
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}
@end
