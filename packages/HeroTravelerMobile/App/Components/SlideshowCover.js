import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'
import ImageWrapper from './ImageWrapper'
import VideoPlayer, {PlayButton} from './VideoPlayer'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {Metrics} from '../Shared/Themes'
import Colors from '../Shared/Themes/Colors'
import getVideoUrl from '../Shared/Lib/getVideoUrl'
import getRelativeHeight, {extractCoverMetrics} from '../Shared/Lib/getRelativeHeight'
import TabIcon from './TabIcon'

export default class SlideshowCover extends Component {
  static propTypes = {
    slideshow: PropTypes.array,
    onPress: PropTypes.func,
    style: PropTypes.number,
    children: PropTypes.object,
    playButtonSize: PropTypes.string,
    autoPlayVideo: PropTypes.bool.isRequired,
    allowVideoPlay: PropTypes.bool.isRequired,
    showPlayButton: PropTypes.bool,
    shouldEnableAutoplay: PropTypes.bool,
    areInRenderLocation: PropTypes.bool,
    title: PropTypes.string,
    isFeed: PropTypes.bool,
    isReadingScreen: PropTypes.bool,
    isGuide: PropTypes.bool,
  }

  static defaultProps = {
    autoPlayVideo: false,
    allowVideoPlay: false,
    areInRenderLocation: true,
  }

  constructor(props) {
    super(props)
    this._tapVideoWrapper = this._tapVideoWrapper.bind(this)
    const startVideoImmediately = props.allowVideoPlay && props.autoPlayVideo && props.shouldEnableAutoplay
    this.state = {
      isPlaying: startVideoImmediately,
      isMuted: props.isFeed,
      currentIndex: 1,
    }
  }

  hasVideo(index) {
    return _.get(this.props, ['slideshow', index, 'purpose']) !== 'coverImage' && !!this.props.slideshow
  }

  hasImage(index) {
    return _.get(this.props, ['slideshow', index, 'purpose']) === 'coverImage' && !!this.props.slideshow
  }

  _getWidthHeight(isOverride = false, index){
    const {isFeed, slideshow, isReadingScreen} = this.props
    const containerWidth = isReadingScreen
      ? Metrics.screenWidth
      : Metrics.screenWidth - 27
    if (isFeed && !isOverride) {
      if (this.hasImage(index)) {
        return { height: Metrics.storyCover.feed.imageTypeHeight }
      }
      else {
        return { height: Metrics.storyCover.feed.slideshowHeight }
      }
    }
    else {
      let height = Math.min(
        Metrics.storyCover.feed.slideshowHeight,
        getRelativeHeight(containerWidth, extractCoverMetrics(slideshow[index])),
      )
      height = Math.max(282, height)
      return {
        width: containerWidth,
        height: height,
      }
    }
  }

  renderImageWithUrl(isVideo, imageUrl, imageThumbnailUrl, index, sliderHeight) {
    const {children, showPlayButton, isFeed, isGuide} = this.props
    // handling for backgroundPublish failures. Covers will not be correctly formatted yet
    const calculatedDimensions = this._getWidthHeight(false, index)
    if (calculatedDimensions.height > sliderHeight) calculatedDimensions.height = sliderHeight
    return (
      <TouchableWithoutFeedback
        style={{flex: 1, overflow: 'hidden'}}
        onPress={this._onPress}
      >
        <View style={{
          ...imageStyle,
          ...calculatedDimensions,
        }}>
          { imageThumbnailUrl && (
            <ImageWrapper
              cached={true}
              resizeMode='cover'
              source={{uri: imageThumbnailUrl}}
              style={this.getEmbeddedImageStyle()}
            />
          )}
          <ImageWrapper
            cached={true}
            resizeMode='cover'
            source={{uri: imageUrl}}
            style={this.getEmbeddedImageStyle()}
          />
          <View style={styles.gradient}>
            {children}
          </View>
          {showPlayButton && isVideo && (
            this.renderPlayButton()
          )}
          {isFeed && isGuide && this.renderGuideIcon()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  getEmbeddedImageStyle = () => ({
    ...embeddedImageStyle,
    width: this.props.isReadingScreen
      ? Metrics.screenWidth
      : '100%',
  })

  renderImage(cover, index, sliderHeight) {
    const calculatedDimensions = this._getWidthHeight(false, 0)
    let imageUrl = getImageUrl(
      cover,
      'optimized',
      calculatedDimensions,
    )
    return this.renderImageWithUrl(false, imageUrl, null, index, sliderHeight)
  }

  _onPress = () => this.props.onPress(this.props.title)

  _tapVideoWrapper() {
    const {onPress, isFeed} = this.props

    // If the video is not playing, invoke the usual callback
    if ((!this.player || isFeed) && onPress) {
      return this._onPress()
    }

    if (!isFeed) this.player.toggle()
  }

  _setIsPlaying = (value) => this.setState({isPlaying: value})

  _togglePlayerRef = () => this.player.toggle()

  _togglePlayerRefMuted = () => this.player.toggleMute()

  _changeMute = (val) => this.setState({isMuted: val})

  _makeRef = (i) => this.player = i

  _handleIndexChanged = (index) => {
    this.setState({
      currentIndex: index + 1,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.autoPlayVideo && !this.props.autoPlayVideo && !this.state.isPlaying) {
      this.setState({isPlaying: true})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.autoPlayVideo !== this.props.autoPlayVideo
      || nextState.isPlaying !== this.state.isPlaying
      || nextState.isMuted !== this.state.isMuted
      || nextState.shouldEnableAutoplay !== this.props.shouldEnableAutoplay
  }

  renderPlayButton() {
    const {playButtonSize} = this.props
    return (
      <PlayButton
        onPress={this._tapVideoWrapper}
        style={[
          styles.playButton,
          playButtonSize === 'small' ? styles.smallPlayButton : {},
        ]}
        size={playButtonSize || 'small'}
      />
    )
  }

  renderGuideIcon() {
    return (
      <TabIcon
        name='guide-alt'
        style={{
          image: styles.guideIcon,
          view: styles.guideIconContainer,
        }}
      />
    )
  }

  /*
  Nota bene. We have two different ways to display the play button. One through the Video
  component and a second through the conditional renders we have below. This should be
  refactored
  */
  renderVideo(cover, index) {
    const videoThumbnailOptions = {
      video: true,
      width: 'screen',
    }

    const videoImageUrl = getImageUrl(cover, 'optimized', videoThumbnailOptions)

    let videoPath = getVideoUrl(cover)
    let nonStreamingVideoPath = getVideoUrl(cover, false)
    const calculatedDimensions = this._getWidthHeight(true, index)
    // If videoPath is a file url, then we do not need preview image or stream url
    if (this.props.isFeed && videoPath && videoPath.startsWith('file://')) {
      return (
        <TouchableWithoutFeedback
          style={{flex: 1, justifyContent: 'center'}}
          onPress={this._onPress}
        >
          <View style={{ flex: 1, ...calculatedDimensions}}>
            <VideoPlayer
              areInRenderLocation={this.props.areInRenderLocation}
              path={videoPath}
              originalPath={nonStreamingVideoPath}
              imgUrl={videoImageUrl}
              ref={this._makeRef}
              allowVideoPlay={this.props.allowVideoPlay && this.props.autoPlayVideo}
              shouldEnableAutoplay={this.props.shouldEnableAutoplay}
              autoPlayVideo={true}
              showPlayButton={false}
              onIsPlayingChange={this._setIsPlaying}
              onMuteChange={this._changeMute}
              isMuted={this.props.isFeed}
              showControls={false}
              resizeMode='cover'
            >
              {this.renderPlayButton()}
            </VideoPlayer>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return (
      <TouchableWithoutFeedback
        style={{
          flex: 1,
          overflow: 'hidden',
          alignItems: 'center',
          position: 'absolute',
          ...calculatedDimensions,
        }}
        onPress={this._onPress}
      >
        <VideoPlayer
          areInRenderLocation={this.props.areInRenderLocation}
          path={videoPath}
          originalPath={nonStreamingVideoPath}
          imgUrl={videoImageUrl}
          ref={this._makeRef}
          allowVideoPlay={this.props.allowVideoPlay && this.props.autoPlayVideo}
          shouldEnableAutoplay={this.props.shouldEnableAutoplay}
          autoPlayVideo
          showPlayButton={false}
          onIsPlayingChange={this._setIsPlaying}
          onMuteChange={this._changeMute}
          isMuted={this.props.isFeed}
          showControls={false}
          resizeMode='cover'
        />
      </TouchableWithoutFeedback>
    )
  }

  renderItem(s, index, sliderHeight) {
    let coverType
    if (s.purpose === 'coverImage' || (s.resource_type === 'image')) coverType = 'image'
    else coverType = 'video'
    return (
      <View key={`${index}`} style={[styles.root, this.props.style]}>
        {this.hasVideo(index) && coverType === 'video' && this.renderVideo(s, index, sliderHeight)}
        {coverType === 'image' && this.renderImage(s, index, sliderHeight)}
        {!coverType && (
          <TouchableWithoutFeedback onPress={this._onPress}>
            <View style={styles.noCover}>
              <Icon
                name='image'
                size={60}
                style={styles.noCoverIcon}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    )
  }

  render() {
    const { slideshow } = this.props
    const { currentIndex } = this.state
    const { height } = this._getWidthHeight(true, 0)

    const rootStyles = {
      flex: 1,
      position: 'relative',
      alignItems: 'center',
      backgroundColor: 'white',
    }
    const moreThanOneSlide = slideshow.length > 1
    if (moreThanOneSlide) {
      rootStyles.marginBottom = 40
    }
    return (
      <View style={rootStyles}>
        <Swiper
          bounces
          loop={false}
          showsButtons={false}
          dotColor="#cccccc"
          activeDotColor="#ed1e2e"
          showsPagination={moreThanOneSlide}
          paginationStyle={paginationStyle}
          onIndexChanged={this._handleIndexChanged}
          style={{
            marginBottom: 20,
            height,
            backgroundColor: 'white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {slideshow.map((s, index) => this.renderItem(s, index, height))}
        </Swiper>
        <View style={styles.topPagination}>
          <Text style={styles.paginationText}>{currentIndex} / {slideshow.length}</Text>
        </View>
      </View>
    )
  }
}

// Image needs to be able to mutate it so we need to give it the raw object
const imageStyle = {
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'relative',
}

const embeddedImageStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

const paginationStyle = {
  bottom: -23,
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginBottom: 40,
    position: 'relative',
    backgroundColor: 'white',
  },
  videoWrapper: {
    flex: 1,
  },
  gradient: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  videoGradient: {
    position: 'absolute',
    bottom: 0,
  },
  playButton: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  readPlayButton: {
    marginTop: -30,
  },
  smallPlayButton: {
    marginTop: -20,
    marginLeft: -20,
  },
  muteButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: Metrics.section * 2,
    right: Metrics.section,
  },
  noCover: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',

  },
  noCoverIcon: {
    color: Colors.lightGreyAreas,
  },
  guideIcon: {
    height: 45,
    width: 38,
  },
  guideIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  topPagination: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
    width: 50,
    height: 30,
  },
  paginationText: {
    color: 'white',
    textAlign: 'center',
  },
})
