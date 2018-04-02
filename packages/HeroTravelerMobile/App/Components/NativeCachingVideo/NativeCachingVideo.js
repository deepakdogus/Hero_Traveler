import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, requireNativeComponent, NativeModules, View, ViewPropTypes, Image} from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import VideoResizeMode from './VideoResizeMode.js';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export default class NativeCachingVideo extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  presentFullscreenPlayer = () => {
    this.setNativeProps({ fullscreen: true });
  };

  dismissFullscreenPlayer = () => {
    this.setNativeProps({ fullscreen: false });
  };

  _assignRoot = (component) => {
    this._root = component;
  };

  _onLoad = (event) => {
    if (this.props.onLoad) {
      this.props.onLoad(event.nativeEvent);
    }
  };

  _onError = (event) => {
    if (this.props.onError) {
      this.props.onError(event.nativeEvent);
    }
  };

  _onEnd = (event) => {
    if (this.props.onEnd) {
      this.props.onEnd(event.nativeEvent);
    }
  };

  _onTimedMetadata = (event) => {
    if (this.props.onTimedMetadata) {
      this.props.onTimedMetadata(event.nativeEvent);
    }
  };

  _onPauseFromUI = (event) => {
    if (this.props.onPauseFromUI) {
      this.props.onPauseFromUI(event.nativeEvent);
    }
  }

  _onPlayFromUI = (event) => {
    if (this.props.onPlayFromUI) {
      this.props.onPlayFromUI(event.nativeEvent);
    }
  }

  _onFullscreenPlayerWillPresent = (event) => {
    if (this.props.onFullscreenPlayerWillPresent) {
      this.props.onFullscreenPlayerWillPresent(event.nativeEvent);
    }
  };

  _onFullscreenPlayerDidPresent = (event) => {
    if (this.props.onFullscreenPlayerDidPresent) {
      this.props.onFullscreenPlayerDidPresent(event.nativeEvent);
    }
  };

  _onFullscreenPlayerWillDismiss = (event) => {
    this.setNativeProps({ fullscreen: false });
    if (this.props.onFullscreenPlayerWillDismiss) {
      this.props.onFullscreenPlayerWillDismiss(event.nativeEvent);
    }
  };

  _onFullscreenPlayerDidDismiss = (event) => {
    this.setNativeProps({ fullscreen: false });
    if (this.props.onFullscreenPlayerDidDismiss) {
      this.props.onFullscreenPlayerDidDismiss(event.nativeEvent);
    }
  };

  _onReadyForDisplay = (event) => {
    if (this.props.onReadyForDisplay) {
      this.props.onReadyForDisplay(event.nativeEvent);
    }
  };

  _onPlaybackStalled = (event) => {
    if (this.props.onPlaybackStalled) {
      this.props.onPlaybackStalled(event.nativeEvent);
    }
  };

  _onPlaybackResume = (event) => {
    if (this.props.onPlaybackResume) {
      this.props.onPlaybackResume(event.nativeEvent);
    }
  };

  _onPlaybackRateChange = (event) => {
    if (this.props.onPlaybackRateChange) {
      this.props.onPlaybackRateChange(event.nativeEvent);
    }
  };

  _onAudioBecomingNoisy = () => {
    if (this.props.onAudioBecomingNoisy) {
      this.props.onAudioBecomingNoisy();
    }
  };

  _onAudioFocusChanged = (event) => {
    if (this.props.onAudioFocusChanged) {
      this.props.onAudioFocusChanged(event.nativeEvent);
    }
  };

  _onBuffer = (event) => {
    if (this.props.onBuffer) {
      this.props.onBuffer(event.nativeEvent);
    }
  };

  render() {
    const resizeMode = this.props.resizeMode;
    const source = resolveAssetSource(this.props.source) || {};

    let uri = source.uri || '';
    if (uri && uri.match(/^\//)) {
      uri = `file://${uri}`;
    }

    let originalUri = source.originalUri || '';

    const isNetwork = !!(uri && uri.match(/^https?:/));
    const isAsset = !!(uri && uri.match(/^(assets-library|file|content|ms-appx|ms-appdata):/));

    let nativeResizeMode;
    if (resizeMode === VideoResizeMode.stretch) {
      nativeResizeMode = NativeModules.UIManager.RCTVideo.Constants.ScaleToFill;
    } else if (resizeMode === VideoResizeMode.contain) {
      nativeResizeMode = NativeModules.UIManager.RCTVideo.Constants.ScaleAspectFit;
    } else if (resizeMode === VideoResizeMode.cover) {
      nativeResizeMode = NativeModules.UIManager.RCTVideo.Constants.ScaleAspectFill;
    } else {
      nativeResizeMode = NativeModules.UIManager.RCTVideo.Constants.ScaleNone;
    }

    const nativeProps = Object.assign({}, this.props);
    Object.assign(nativeProps, {
      style: [styles.base, nativeProps.style],
      resizeMode: nativeResizeMode,
      src: {
        uri,
        originalUri,
        isNetwork,
        isAsset,
        type: source.type || '',
        mainVer: source.mainVer || 0,
        patchVer: source.patchVer || 0,
      },
      onVideoLoad: this._onLoad,
      onVideoError: this._onError,
      onVideoEnd: this._onEnd,
      onVideoBuffer: this._onBuffer,
      onTimedMetadata: this._onTimedMetadata,
      onPauseFromUI: this._onPauseFromUI,
      onPlayFromUI: this._onPlayFromUI,
      onVideoFullscreenPlayerWillPresent: this._onFullscreenPlayerWillPresent,
      onVideoFullscreenPlayerDidPresent: this._onFullscreenPlayerDidPresent,
      onVideoFullscreenPlayerWillDismiss: this._onFullscreenPlayerWillDismiss,
      onVideoFullscreenPlayerDidDismiss: this._onFullscreenPlayerDidDismiss,
      onReadyForDisplay: this._onReadyForDisplay,
      onPlaybackStalled: this._onPlaybackStalled,
      onPlaybackResume: this._onPlaybackResume,
      onPlaybackRateChange: this._onPlaybackRateChange,
      onAudioFocusChanged: this._onAudioFocusChanged,
      onAudioBecomingNoisy: this._onAudioBecomingNoisy,
    });

    return (
      <RCTVideo
        ref={this._assignRoot}
        {...nativeProps}
      />
    );
  }
}

NativeCachingVideo.propTypes = {
  /* Native only */
  src: PropTypes.object,
  needsVideoLoaded: PropTypes.bool,
  fullscreen: PropTypes.bool,
  onVideoLoad: PropTypes.func,
  onVideoBuffer: PropTypes.func,
  onVideoError: PropTypes.func,
  onVideoEnd: PropTypes.func,
  onTimedMetadata: PropTypes.func,
  onPauseFromUI: PropTypes.func,
  onPlayFromUI: PropTypes.func,
  onVideoFullscreenPlayerWillPresent: PropTypes.func,
  onVideoFullscreenPlayerDidPresent: PropTypes.func,
  onVideoFullscreenPlayerWillDismiss: PropTypes.func,
  onVideoFullscreenPlayerDidDismiss: PropTypes.func,

  /* Wrapper component */
  source: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
      originalUri: PropTypes.string,
    }),
    // Opaque type returned by require('./video.mp4')
    PropTypes.number
  ]),
  resizeMode: PropTypes.string,
  repeat: PropTypes.bool,
  paused: PropTypes.bool,
  muted: PropTypes.bool,
  volume: PropTypes.number,
  rate: PropTypes.number,
  playInBackground: PropTypes.bool,
  playWhenInactive: PropTypes.bool,
  ignoreSilentSwitch: PropTypes.oneOf(['ignore', 'obey']),
  disableFocus: PropTypes.bool,
  onLoad: PropTypes.func,
  onBuffer: PropTypes.func,
  onError: PropTypes.func,
  onEnd: PropTypes.func,
  onFullscreenPlayerWillPresent: PropTypes.func,
  onFullscreenPlayerDidPresent: PropTypes.func,
  onFullscreenPlayerWillDismiss: PropTypes.func,
  onFullscreenPlayerDidDismiss: PropTypes.func,
  onReadyForDisplay: PropTypes.func,
  onPlaybackStalled: PropTypes.func,
  onPlaybackResume: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onAudioFocusChanged: PropTypes.func,
  onAudioBecomingNoisy: PropTypes.func,

  /* Required by react-native */
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
  translateX: PropTypes.number,
  translateY: PropTypes.number,
  rotation: PropTypes.number,
  ...ViewPropTypes,
};

const RCTVideo = requireNativeComponent('RCTVideo', NativeCachingVideo, {
  nativeOnly: {
    src: true,
    fullscreen: true,
  },
});
