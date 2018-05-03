#import <React/RCTView.h>
#import <AVFoundation/AVFoundation.h>
#import "AVKit/AVKit.h"
#import "UIView+FindUIViewController.h"
#import "RCTVideoPlayerViewController.h"
#import "RCTVideoPlayerViewControllerDelegate.h"

@class RCTEventDispatcher;

@interface RCTVideo : UIView <RCTVideoPlayerViewControllerDelegate>

@property (nonatomic, copy) RCTBubblingEventBlock onVideoLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoBuffer;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoError;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoEnd;
@property (nonatomic, copy) RCTBubblingEventBlock onTimedMetadata;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerWillPresent;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerDidPresent;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerWillDismiss;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoFullscreenPlayerDidDismiss;
@property (nonatomic, copy) RCTBubblingEventBlock onReadyForDisplay;
@property (nonatomic, copy) RCTBubblingEventBlock onPlaybackStalled;
@property (nonatomic, copy) RCTBubblingEventBlock onPlaybackResume;
@property (nonatomic, copy) RCTBubblingEventBlock onPlaybackRateChange;

@property (nonatomic, copy) RCTBubblingEventBlock onPauseFromUI;
@property (nonatomic, copy) RCTBubblingEventBlock onPlayFromUI;

@property (nonatomic, assign) BOOL needsVideoLoaded;
@property (nonatomic, assign) BOOL showControls;

- (BOOL) shouldRepeat;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

- (AVPlayerViewController*)createPlayerViewController:(AVPlayer*)player withPlayerItem:(AVPlayerItem*)playerItem;

- (void) displayWithPlayer:(AVPlayer*)player playerItem:(AVPlayerItem*)playerItem;
- (void) applyModifiersOnPlayer:(AVPlayer*)player playerItem:(AVPlayerItem*)playerItem;

- (void) purgePlayingVideo;
- (void) restorePlayingVideo;

- (BOOL) isDisplayingFullscreen;
- (BOOL) isPlaying;

- (float) rate;

- (void) applyModifiers;

- (void) setIsBuffering:(BOOL)isBuffering;

@end
