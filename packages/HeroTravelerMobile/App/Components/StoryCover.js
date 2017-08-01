import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'

import Image from './Image'
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
    gradientColors: PropTypes.arrayOf(PropTypes.string),
    gradientLocations: PropTypes.arrayOf(PropTypes.number)
  }

  static defaultProps = {
    autoPlayVideo: false,
    allowVideoPlay: false,
    gradientColors: ['transparent', 'rgba(0,0,0,.65)'],
    gradientLocations: [.5, 1],
  }

  constructor(props) {
    super(props)
    this._tapVideoWrapper = this._tapVideoWrapper.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo
    this.state = {
      isPlaying: startVideoImmediately,
      isMuted: __DEV__,
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
          cached={true}
          resizeMode='cover'
          source={{uri: getImageUrl(this.props.cover)}}
          style={[styles.image]}
        >
          <LinearGradient
            locations={this.props.gradientLocations}
            colors={this.props.gradientColors}
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

  _setIsPlaying = (value) => this.setState({isPlaying: value})

  _togglePlayerRef = () => this.player.toggle()

  _togglePlayerRefMuted = () => this.player.toggleMute()

  _changeMute = (val) => this.setState({isMuted: val})

  _makeRef = (i) => this.player = i

  /*
  Nota bene. We have two different ways to display the play button. One through the Video
  component and a second through the conditional renders we have below. This should be
  refactored
  */
  renderVideo() {
    return (
      <View style={{flex: 1}}>
        <Video
          path={getVideoUrl(this.props.cover)}
          ref={this._makeRef}
          allowVideoPlay={this.props.allowVideoPlay}
          autoPlayVideo={this.props.autoPlayVideo}
          showPlayButton={false}
          onIsPlayingChange={this._setIsPlaying}
          onMuteChange={this._changeMute}
          resizeMode='cover'
        />
        <TouchableWithoutFeedback
          onPress={this._tapVideoWrapper}>
          <LinearGradient
            locations={this.props.gradientLocations}
            colors={this.props.gradientColors}
            style={[styles.gradient, styles.videoGradient]}
          >
            {this.props.children}
          </LinearGradient>
        </TouchableWithoutFeedback>
        {this.props.allowVideoPlay && <PlayButton
          onPress={this._togglePlayerRef}
          isPlaying={this.state.isPlaying}
          videoFadeAnim={this.player && this.player.getAnimationState()}
          style={styles.playButton}
        />}
        {this.props.allowVideoPlay && this.state.isPlaying &&
          <MuteButton
            onPress={this._togglePlayerRefMuted}
            isMuted={this.state.isMuted}
            style={styles.muteButton}
          />
        }
         {this.props.showPlayButton &&
          <PlayButton style={styles.playButton}/>
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
    justifyContent: "flex-end",
    position: 'relative'
  },
  videoWrapper: {
    flex: 1,
  },
  gradient: {
    paddingHorizontal: 25,
    paddingVertical: Metrics.doubleBaseMargin,
    // height: Metrics.screenHeight/2 - Metrics.navBarHeight,
    // width: Metrics.screenWidth,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
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
    top: Metrics.section*2,
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
