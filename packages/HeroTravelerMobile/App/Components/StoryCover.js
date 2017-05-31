import React, {PropTypes, Component} from 'react'
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'

import Video, {MuteButton, PlayButton} from './Video'
import getImageUrl from '../Lib/getImageUrl'
import {Metrics} from '../Themes'
import Colors from '../Themes/Colors'
import getVideoUrl from '../Lib/getVideoUrl'

export default class StoryCover extends Component {

  static propTypes = {
    // cover: PropTypes.object.isRequired,
    coverType: PropTypes.oneOf(['image', 'video']).isRequired,
    onPress: PropTypes.func,
    autoPlayVideo: PropTypes.bool.isRequired,
    allowVideoPlay: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    // this._togglePlayVideo = this._togglePlayVideo.bind(this)
    this._tapVideoWrapper = this._tapVideoWrapper.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo
    this.state = {
      isPlaying: startVideoImmediately,
      isMuted: __DEV__,
      // showVideoPlayButton: props.allowVideoPlay && !startVideoImmediately,
      // videoEnded: false,
      // videoFadeAnim: props.allowVideoPlay ? new Animated.Value(1) : new Animated.Value(0)
      videoLoaded: false
    }
  }

  hasVideo() {
    return this.props.coverType === 'video' && !! this.props.cover
  }

  hasImage() {
    return this.props.coverType === 'image' && !! this.props.cover
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
          <LinearGradient
            colors={['transparent', '#333333']}
            style={styles.gradient}
          >
            {this.props.children}
          </LinearGradient>
        </Image>
      </TouchableWithoutFeedback>
    )
  }

  _tapVideoWrapper() {
    const {onPress} = this.props

    // If the video is not playing, invoke the usual callback
    if (!this.player.getIsPlaying() && onPress) {
      return this.props.onPress()
    }

    this.player.toggle()
  }

  renderVideo() {
    return (
      <View style={{flex: 1}}>
        <Video
          path={getVideoUrl(this.props.cover)}
          ref={i => this.player = i}
          allowVideoPlay={this.props.allowVideoPlay}
          autoPlayVideo={this.props.autoPlayVideo}
          showPlayButton={false}
          onIsPlayingChange={(value) => this.setState({isPlaying: value})}
          onMuteChange={val => this.setState({isMuted: val})}
          onLoad={() => this.setState({videoLoaded: true})}
          style={[
            this.props.videoStyle,
          ]}
        />
        <TouchableWithoutFeedback
          onPress={this._tapVideoWrapper}>
          <LinearGradient
            colors={['transparent', '#333333']}
            style={[styles.gradient, styles.videoGradient]}
          >
            {this.props.children}
          </LinearGradient>
        </TouchableWithoutFeedback>
        {this.props.allowVideoPlay && <PlayButton
          onPress={() => this.player.toggle()}
          isPlaying={this.state.isPlaying}
          videoFadeAnim={this.player && this.player.getAnimationState()}
          style={styles.playButton}
        />}
        {this.props.allowVideoPlay && this.state.isPlaying &&
          <MuteButton
            onPress={() => this.player.toggleMute()}
            isMuted={this.state.isMuted}
            style={styles.muteButton}
          />
        }
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.root, this.props.style]}>
        {this.hasVideo() && this.renderVideo()}
        {this.hasImage() && this.renderImage()}
        {!this.props.cover &&
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <View style={styles.noCover}>
              <Icon
                name='image'
                size={60}
                style={styles.noCoverIcon}
              />
            </View>
          </TouchableWithoutFeedback>
        }
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
  gradient: {
    paddingHorizontal: 25,
    paddingVertical: Metrics.doubleBaseMargin,
    height: Metrics.screenHeight/2 - Metrics.navBarHeight,
  },
  videoGradient: {
    position: 'absolute',
    bottom: 0
  },
  playButton: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  muteButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: Metrics.section,
    right: Metrics.section,
  },
  noCover: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',

  },
  noCoverIcon: {
    color: Colors.lightGreyAreas

  }
})
