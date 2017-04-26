import React, {PropTypes, Component} from 'react'
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/FontAwesome'

import getImageUrl from '../Lib/getImageUrl'
import {Metrics} from '../Themes'
import Colors from '../Themes/Colors'
import getVideoUrl from '../Lib/getVideoUrl'

const buttonLarge = 80
const buttonSmall = 40
const VideoButton = ({size, icon, onPress}) => {
  const sizeUnits = size !== 'small' ? buttonLarge : buttonSmall
  return (
    <TouchableWithoutFeedback
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
        <Icon
          name={icon}
          size={sizeUnits / 2}
          color={Colors.snow}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default class StoryCover extends Component {

  static propTypes = {
    cover: PropTypes.object.isRequired,
    coverType: PropTypes.oneOf(['image', 'video']).isRequired,
    onPress: PropTypes.func,
    autoPlayVideo: PropTypes.bool.isRequired,
    allowVideoPlay: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this._togglePlayVideo = this._togglePlayVideo.bind(this)
    this._tapVideoWrapper = this._tapVideoWrapper.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo
    this.state = {
      videoPlaying: startVideoImmediately,
      videoStarted: startVideoImmediately,
      showVideoPlayButton: props.allowVideoPlay && !startVideoImmediately,
      videoEnded: false,
      videoFadeAnim: props.allowVideoPlay ? new Animated.Value(1) : new Animated.Value(0)
    }
  }

  componentDidMount() {
    if (this.props.autoPlayVideo) {
      this.fadeOutVideoUI(2000)
    }
  }

  isVideo() {
    return this.props.coverType === 'video'
  }

  renderImage() {
    return (
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={this.props.onPress}
      >
        <Image
          resizeMode="cover"
          source={{uri: getImageUrl(this.props.cover)}}
          style={[styles.image]}
        >
          <LinearGradient colors={['transparent', 'black']} style={styles.gradient}>
            {this.props.children}
          </LinearGradient>
        </Image>
      </TouchableWithoutFeedback>
    )
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
      this.player.seek(0)
      this.fadeOutVideoUI()
      return this.setState({
        videoPlaying: true,
        videoEnded: false
      })
    }

    if (newPlayingState) {
      this.fadeOutVideoUI()
    } else {
      this.fadeInVideoUI()
    }

    return this.setState({
      videoPlaying: newPlayingState
    })
  }

  _tapVideoWrapper() {
    const {onPress} = this.props

    // If the video is not playing, invoke the usual callback
    if (!this.state.videoPlaying && onPress) {
      return this.props.onPress()
    }

    this._togglePlayVideo()
  }

  renderVideo() {
    return (
      <TouchableWithoutFeedback onPress={this._tapVideoWrapper}>
        <View style={styles.videoWrapper}>
          <Video
            source={{uri: getVideoUrl(this.props.cover)}}
            ref={i => this.player = i}
            paused={!this.state.videoPlaying}
            muted={__DEV__}
            style={[styles.video, this.props.videoStyle]}
            onEnd={this._onVideoEnd}
            onError={(err) => alert(err)}
            resizeMode='cover'
          />
          <View style={styles.videoChildren}>
            {this.props.children}
          </View>
          {this.props.allowVideoPlay &&
          <Animated.View
            style={[styles.buttons, {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: this.state.videoFadeAnim
            }]}
          >
            <VideoButton
              onPress={this._togglePlayVideo}
              icon={this.state.videoPlaying ? 'pause' : 'play'}
            />
          </Animated.View>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
      <View style={[styles.root, this.props.style]}>
        {this.isVideo() ? this.renderVideo() : this.renderImage()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.clear
  },
  image: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  videoWrapper: {
    flex: 1,
  },
  videoChildren: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: Metrics.doubleBaseMargin,
  },
  video: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  buttons: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'red',
    paddingTop: 125,
    bottom: 125
  },
  videoPlayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.doubleBaseMargin
  },
})
