import React from 'react'
import {View, Animated, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import TabIcon from './TabIcon'
import Video from 'react-native-video'

import Colors from '../Themes/Colors'

const buttonLarge = 80
const buttonSmall = 40
const VideoButton = ({size, icon, onPress, style = {}}) => {
  const sizeUnits = size !== 'small' ? buttonLarge : buttonSmall
  return (
    <TouchableWithoutFeedback
      style={style}
      onPress={onPress}>
      <View
        style={{
          width: sizeUnits,
          height: sizeUnits,
          borderRadius: sizeUnits / 2,
          backgroundColor: Colors.windowTint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        { !(icon === 'audio-off' || icon === 'audio-on') &&
        <Icon
          name={icon}
          size={sizeUnits / 2}
          color={Colors.snow}
        />
        }
        { (icon === 'audio-off' || icon === 'audio-on') &&
          <TabIcon
            style={{
              image: {
                width: 15,
                height: 15,
              }
            }}
            name={icon}
          />
        }
      </View>
    </TouchableWithoutFeedback>
  )
}

export const PlayButton = ({videoFadeAnim, onPress, isPlaying, style = {}}) => {
  return (
    <Animated.View
      style={[
        style,
        {opacity: videoFadeAnim}
      ]}
    >
      <VideoButton
        onPress={onPress}
        icon={isPlaying ? 'pause' : 'play'}
      />
    </Animated.View>
  )
}

export const MuteButton = ({onPress, isMuted, style = {}}) => {
  return (
    <View style={style}>
      <VideoButton
        size='small'
        icon={isMuted ? 'audio-off' : 'audio-on'}
        onPress={onPress}
      />
    </View>
  )
}

export default class VideoPlayer extends React.Component {

  static defaultProps = {
    muted: false,
    showPlayButton: true
  }

  constructor(props) {
    super(props)

    this._togglePlayVideo = this._togglePlayVideo.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo

    this.state = {
      videoPlaying: startVideoImmediately,
      videoStarted: startVideoImmediately,
      videoEnded: false,
      videoFadeAnim: props.allowVideoPlay ? new Animated.Value(1) : new Animated.Value(0),
      // Sound is muted in __DEV__ because it gets annoying
      muted: __DEV__,
    }
  }

  componentDidMount() {
    if (this.props.autoPlayVideo) {
      this.fadeOutVideoUI(2000)
    }
  }

  fadeInVideoUI(duration = 300) {
    Animated.timing(
      this.state.videoFadeAnim,
      {
        toValue: 1,
        duration
      },
    ).start()
  }

  fadeOutVideoUI(duration = 300) {
    Animated.timing(
      this.state.videoFadeAnim,
      {
        toValue: 0,
        duration
      },
    ).start()
  }

  // warning, setting videoPlaying: false here will
  // probably prevent the repeat functionality of <Video />
  _onVideoEnd = () => {
    this.fadeInVideoUI()
    this._onIsPlaying(false)
    this.setState({
      videoPlaying: false,
      videoEnded: true
    })
  }

  _togglePlayVideo() {
    const newPlayingState = !this.state.videoPlaying

    // If the video ended, go to the beginning
    // of the video and play again
    if (this.state.videoEnded) {
      this._onIsPlaying(true)
      this.player.seek(0)
      this.fadeOutVideoUI()
      return this.setState({
        videoPlaying: true,
        videoEnded: false
      })
    }

    this._onIsPlaying(newPlayingState)

    if (newPlayingState) {
      this.fadeOutVideoUI()
    } else {
      this.fadeInVideoUI()
    }

    return this.setState({
      videoPlaying: newPlayingState
    })
  }

  _onLoad = () => {
    if (this.props.onLoad) this.props.onLoad(true)
    this.setState({
      loaded: true
    })
  }

  _onIsPlaying(val) {
    if (this.props.onIsPlayingChange) {
      this.props.onIsPlayingChange(val)
    }
  }

  getIsPlaying() {
    return this.state.videoPlaying
  }

  toggle() {
    return this._togglePlayVideo()
  }

  getAnimationState() {
    return this.state.videoFadeAnim
  }

  toggleMute() {
    const newMuteState = !this.state.muted
    if (this.props.onMuteChange) {
      this.props.onMuteChange(newMuteState)
    }

    this.setState({muted: newMuteState})
  }

  render() {
    return (
      <View style={[styles.root, this.props.style]}>
        <Video
          source={{uri: this.props.path}}
          ref={i => this.player = i}
          paused={!this.state.videoPlaying}
          muted={this.state.muted}
          style={[styles.video]}
          repeat={true}
          onError={(err) => console.log('Video Error: ', err)}
          resizeMode='cover'
          onLoad={this._onLoad}
        />
        {this.props.showPlayButton &&
          <PlayButton
            style={styles.buttons}
            onPress={this._togglePlayVideo}
            isPlaying={this.state.videoPlaying}
            videoFadeAnim={this.state.videoFadeAnim} />
        }
        {this.props.showPlayButton &&
          <MuteButton
            style={styles.mute}
            onPress={() => this.toggleMute()}
            isMuted={this.state.muted}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  video: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  buttons: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
  },
  mute: {

  }
})
