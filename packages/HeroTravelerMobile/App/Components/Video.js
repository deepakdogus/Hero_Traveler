import React from 'react'
import {View, Animated, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import Video from 'react-native-video'
import TabIcon from './TabIcon'
import Image from './Image'
import MediaSelectorStyles from '../Containers/Styles/MediaSelectorScreenStyles'

import Colors from '../Shared/Themes/Colors'

const buttonLarge = 60
const buttonSmall = 40
const buttonTiny = 20
const VideoButton = ({size, icon, onPress, style = {}, text}) => {
  let sizeUnits = buttonLarge
  if (size === 'small') sizeUnits = buttonSmall
  if (size === 'tiny') sizeUnits = buttonTiny

  return (
    <TouchableWithoutFeedback
      style={style}
      onPress={onPress}>
      <View
        style={text ? styles.videoBtnText :
          [{
            width: sizeUnits,
            height: sizeUnits,
            borderRadius: sizeUnits / 2,
          }, styles.videoBtnImg]
        }
      >
        { !text && !(icon === 'audio-off' || icon === 'audio-on') &&
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
        { text &&
          <Text style={MediaSelectorStyles.retakeButtonText}>{text}</Text>
        }
      </View>
    </TouchableWithoutFeedback>
  )
}

export const PlayButton = ({videoFadeAnim, onPress, isPlaying, style = {}, size}) => {
  return (
    <Animated.View
      style={[
        style,
        {opacity: videoFadeAnim}
      ]}
    >
      <VideoButton
        onPress={onPress}
        size={size}
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

  static propTypes = {
    autoPlayVideo: PropTypes.bool,
    allowVideoPlay: PropTypes.bool,
    isMuted: PropTypes.bool,
    shouldEnableAutoplay: PropTypes.bool,
  }

  static defaultProps = {
    showMuteButton: true,
    showPlayButton: true,
    videoFillSpace: true,
    resizeMode: 'contain'
  }

  constructor(props) {
    super(props)

    this._togglePlayVideo = this._togglePlayVideo.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo && props.shouldEnableAutoplay !== undefined

    this.state = {
      videoPlaying: startVideoImmediately,
      videoStarted: startVideoImmediately,
      videoFadeAnim: props.allowVideoPlay ? new Animated.Value(1) : new Animated.Value(0),
      // Sound is muted in __DEV__ because it gets annoying
      muted: props.isMuted,
    }
  }

  componentDidMount() {
    if (this.props.autoPlayVideo) {
      this.fadeOutVideoUI(1500)
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

  _togglePlayVideo() {
    if (!this.props.allowVideoPlay) {
      return
    }

    const newPlayingState = !this.state.videoPlaying

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

  goFullscreen() {
    this.player.presentFullscreenPlayer()
  }

  _bindRef = (i) => this.player = i

  // using hasStarted to know when we should toggle from pending loading image to playable video
  setStarted = () => {
    if (!this.state.hasStarted) {
      this.setState({hasStarted: true})
    }
  }

  // currently only need for new cover videos
  _onLoad = (event) => {
    this.setStarted()
    if (!this.props.onLoad) return
    this.props.onLoad(event.naturalSize)
  }

  _getShouldEnableAutoplay(){
    if (this.props.shouldEnableAutoplay === undefined) return true
    else return this.props.shouldEnableAutoplay
  }

  isPaused(){
    // "if" means we are viewing a story directly
    if (this.props.shouldEnableAutoplay === undefined) {
      return !this.state.videoPlaying
    }
    else return !this.props.shouldEnableAutoplay
  }

  render() {
    const playButtonSize = this.props.playButtonSize

    return (
      <View style={[
        styles.root,
        this.props.videoFillSpace && styles.full,
        this.props.style
      ]}>
        {this.props.imgUrl &&
        <Image
          cached={true}
          resizeMode='cover'
          source={{uri: this.props.imgUrl}}
          style={[
            styles.video,
            {zIndex: this.state.hasStarted ? -1 : 1}
          ]}
        />
        }
        <Video
          source={{uri: this.props.path}}
          ref={this._bindRef}
          paused={this.isPaused()}
          muted={this.state.muted}
          style={[
            styles.video,
            this.props.videoFillSpace && styles.full,
          ]}
          repeat={true}
          onProgress={this.setStarted}
          onLoad={this._onLoad}
          resizeMode={this.props.resizeMode}
        />
        {this.props.showPlayButton &&
          <PlayButton
            style={[this.props.videoFillSpace ? styles.fullButtons : styles.buttons, playButtonSize === 'small' ? styles.smallButton : {}]}
            onPress={this._togglePlayVideo}
            isPlaying={this.state.videoPlaying}
            size={playButtonSize}
            videoFadeAnim={this.state.videoFadeAnim} />
        }
        {this.props.showMuteButton && this.props.showPlayButton &&
          <MuteButton
            style={styles.mute}
            onPress={this.toggleMute}
            isMuted={this.state.muted}
          />
        }
        {
          this.props.showChangeBtn &&
          <View style={styles.changeBtn}>
            <VideoButton
              text='CHANGE'
              onPress={this.props.changeBtnOnPress}
            />
          </View>
        }
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  full: {
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  fullButtons: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  smallButton: {
    marginLeft: -20,
    marginTop: -20,
  },
  mute: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  changeBtn: {
    position: 'absolute',
    bottom: 60,
  },
  videoBtnText: {
    backgroundColor: Colors.blackoutTint,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 95,
    height: 35,
  },
  videoBtnImg: {
    backgroundColor: Colors.windowTint,
    alignItems: 'center',
    justifyContent: 'center',
  }
})