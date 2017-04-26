import React, {PropTypes, Component} from 'react'
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import Video, {PlayButton} from './Video'
import getImageUrl from '../Lib/getImageUrl'
import {Metrics} from '../Themes'
import Colors from '../Themes/Colors'
import getVideoUrl from '../Lib/getVideoUrl'

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
    // this._togglePlayVideo = this._togglePlayVideo.bind(this)
    this._tapVideoWrapper = this._tapVideoWrapper.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo
    this.state = {
      isPlaying: startVideoImmediately,
      // showVideoPlayButton: props.allowVideoPlay && !startVideoImmediately,
      // videoEnded: false,
      // videoFadeAnim: props.allowVideoPlay ? new Animated.Value(1) : new Animated.Value(0)
      videoLoaded: false
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
          onLoad={() => this.setState({videoLoaded: true})}
          style={[
            this.props.videoStyle,
          ]}
        />
        <TouchableWithoutFeedback
          onPress={this._tapVideoWrapper}>
          <View style={[
            styles.videoChildren
          ]}>
            {this.props.children}
          </View>
        </TouchableWithoutFeedback>
        {this.props.allowVideoPlay && <PlayButton
          onPress={() => this.player.toggle()}
          isPlaying={this.state.isPlaying}
          videoFadeAnim={this.player && this.player.getAnimationState()}
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            top: '50%',
            left: '50%',
            marginTop: -50,
            marginLeft: -50
          }}
        />}
      </View>
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
    // zIndex: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: Metrics.doubleBaseMargin,
  },
  gradient: {
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.doubleBaseMargin
  },
})
