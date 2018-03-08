import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImageWrapper from './ImageWrapper'
import VideoPlayer, {MuteButton, PlayButton} from './VideoPlayer'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {Metrics} from '../Shared/Themes'
import Colors from '../Shared/Themes/Colors'
import getVideoUrl from '../Shared/Lib/getVideoUrl'

export default class StoryCover extends Component {

  static propTypes = {
    coverType: PropTypes.oneOf(['image', 'video']).isRequired,
    cover: PropTypes.object,
    onPress: PropTypes.func,
    style: PropTypes.object,
    children: PropTypes.object,
    playButtonSize: PropTypes.string,
    autoPlayVideo: PropTypes.bool.isRequired,
    allowVideoPlay: PropTypes.bool.isRequired,
    showPlayButton: PropTypes.bool,
    gradientColors: PropTypes.arrayOf(PropTypes.string),
    gradientLocations: PropTypes.arrayOf(PropTypes.number),
    shouldEnableAutoplay: PropTypes.bool,
    areInRenderLocation: PropTypes.bool,
    storyTitle: PropTypes.string,
  }

  static defaultProps = {
    autoPlayVideo: false,
    allowVideoPlay: false,
    gradientColors: ['transparent', 'rgba(0,0,0,.65)'],
    gradientLocations: [.5, 1],
    areInRenderLocation: true,
  }

  constructor(props) {
    super(props)
    this._tapVideoWrapper = this._tapVideoWrapper.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo && props.shouldEnableAutoplay
    this.state = {
      isPlaying: startVideoImmediately,
      isMuted: props.isFeed,
    }
  }

  hasVideo() {
    return this.props.coverType === 'video' && !!this.props.cover
  }

  hasImage() {
    return this.props.coverType === 'image' && !!this.props.cover
  }

  _getWidthHeight(){
    if (this.props.isFeed) {
      return { height: Metrics.storyCover.feed.height }
    } else {
      return {
        width: Metrics.screenWidth,
        height: Metrics.storyCover.fullScreen.height,
      }
    }
  }

  // if it is a local URL there is no need to cache since it is directly on phone
  isLocalUrl(cover){
    return cover.uri || cover.secure_url
  }

  renderImageWithUrl(isVideo, imageUrl, imageThumbnailUrl) {
    const {cover, onPress, gradientLocations, gradientColors, children, showPlayButton, playButtonSize} = this.props
    // handling for backgroundPublish failures. Covers will not be correctly formatted yet

    return (
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={this._onPress}
      >
        <View style={{
          ...imageStyle,
          ...this._getWidthHeight(),
          maxHeight: Metrics.storyCover.fullScreen.height,
        }}>
        { imageThumbnailUrl &&
          <ImageWrapper
            cached={!this.isLocalUrl(cover)}
            resizeMode='cover'
            source={{uri: imageThumbnailUrl}}
            style={embeddedImageStyle}
          />
        }
          <ImageWrapper
            cached={!this.isLocalUrl(cover)}
            resizeMode='cover'
            source={{uri: imageUrl}}
            style={embeddedImageStyle}
          />
          <View style={styles.gradient}>
            {children}
          </View>
        {showPlayButton && isVideo &&
          <PlayButton
            onPress={this._tapVideoWrapper}
            style={[
              styles.playButton,
              playButtonSize === 'small' ? styles.smallPlayButton : {}
            ]}
            size={playButtonSize || 'small'}
          />
         }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderImage() {
    let imageUrl = getImageUrl(this.props.cover, 'optimized', {width: 'screen', height: Metrics.storyCover.fullScreen.height})
    return this.renderImageWithUrl(false, imageUrl)
  }

  _onPress = () => {
    return this.props.onPress(this.props.storyTitle)
  }

  _tapVideoWrapper() {
    const {onPress} = this.props

    // If the video is not playing, invoke the usual callback
    if ((!this.player || !this.player.getIsPlaying() || this.props.isFeed) && onPress) {
      return this._onPress()
    }

    if (!this.props.isFeed) this.player.toggle()
  }

  _setIsPlaying = (value) => this.setState({isPlaying: value})

  _togglePlayerRef = () => this.player.toggle()

  _togglePlayerRefMuted = () => this.player.toggleMute()

  _changeMute = (val) => this.setState({isMuted: val})

  _makeRef = (i) => this.player = i

  componentWillReceiveProps(nextProps) {
    if (nextProps.autoPlayVideo && !this.props.autoPlayVideo && !this.state.isPlaying) {
      this.setState({isPlaying: true})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.autoPlayVideo !== this.props.autoPlayVideo ||
    nextState.isPlaying !== this.state.isPlaying ||
    nextState.isMuted !== this.state.isMuted ||
    nextState.shouldEnableAutoplay !== this.props.shouldEnableAutoplay
  }

  /*
  Nota bene. We have two different ways to display the play button. One through the Video
  component and a second through the conditional renders we have below. This should be
  refactored
  */
  renderVideo() {
    const videoThumbnailOptions = {
      video: true,
      width: 'screen',
      height: Metrics.storyCover.fullScreen.height,
    }

    const videoImageUrl = getImageUrl(this.props.cover, 'optimized', videoThumbnailOptions)

    if (this.props.isFeed) {
      return this.renderImageWithUrl(true, videoImageUrl)
    }

    let videoPath = getVideoUrl(this.props.cover)
    let nonStreamingVideoPath = getVideoUrl(this.props.cover, false)

    return (
      <View style={this._getWidthHeight()}>
        <VideoPlayer
          areInRenderLocation={this.props.areInRenderLocation}
          path={videoPath}
          originalPath={nonStreamingVideoPath}
          imgUrl={videoImageUrl}
          ref={this._makeRef}
          allowVideoPlay={this.props.allowVideoPlay && this.props.autoPlayVideo}
          shouldEnableAutoplay={this.props.shouldEnableAutoplay}
          autoPlayVideo={this.props.autoPlayVideo}
          showPlayButton={false}
          onIsPlayingChange={this._setIsPlaying}
          onMuteChange={this._changeMute}
          isMuted={this.props.isFeed}
          resizeMode='cover'
        />
        <TouchableWithoutFeedback
          onPress={this._tapVideoWrapper}
        >
          <View
            style={[styles.gradient, styles.videoGradient]}
          >
            {this.props.children}
          </View>
        </TouchableWithoutFeedback>
        {this.props.allowVideoPlay && !this.state.isPlaying && this.props.shouldEnableAutoplay && !this.props.isFeed &&
        <PlayButton
          onPress={this._togglePlayerRef}
          isPlaying={this.state.isPlaying}
          videoFadeAnim={this.player && this.player.getAnimationState()}
          style={styles.playButton}
        />}
        {this.props.allowVideoPlay && this.state.isPlaying && !this.props.isFeed &&
          <MuteButton
            onPress={this._togglePlayerRefMuted}
            isMuted={this.state.isMuted}
            style={styles.muteButton}
          />
        }
         {this.props.showPlayButton &&
          <PlayButton
            onPress={this._tapVideoWrapper}
            style={[styles.playButton, styles.smallPlayButton]}
            size='small'
          />
         }
      </View>
    )
  }

  render() {
    let coverType;
    if (this.hasImage()) coverType = 'image'
    else if (this.hasVideo()) coverType = 'video'

    return (
      <View style={[styles.root, this.props.style]}>
        {this.hasVideo() && coverType === 'video' && this.renderVideo()}
        {coverType === 'image' && this.renderImage()}
        {!coverType &&
          <TouchableWithoutFeedback onPress={this._onPress}>
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

// Image needs to be able to mutate it so we need to give it the raw object
const imageStyle = {
  width: Metrics.screenWidth,
  flexDirection: "column",
  justifyContent: "flex-end",
  position: 'relative'
}

const embeddedImageStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.clear
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
    marginLeft: -30,
  },
  smallPlayButton: {
    marginTop: -20,
    marginLeft: -20,
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
