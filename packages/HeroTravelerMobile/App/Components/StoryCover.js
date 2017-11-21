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
import getImageUrl from '../Shared/Lib/getImageUrl'
import {Metrics} from '../Shared/Themes'
import Colors from '../Shared/Themes/Colors'
import getVideoUrl from '../Shared/Lib/getVideoUrl'
import getRelativeHeight from '../Shared/Lib/getRelativeHeight'

export default class StoryCover extends Component {

  static propTypes = {
    // cover: PropTypes.object.isRequired,
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
    return this.props.coverType === 'video' && !!this.props.cover
  }

  hasImage() {
    return this.props.coverType === 'image' && !!this.props.cover
  }

  _getWidthHeight(){
    return {
      width: Metrics.screenWidth,
      height: getRelativeHeight(Metrics.screenWidth, this.props.cover.original.meta)
    }
  }

  renderImage() {
    const {cover, onPress, gradientLocations, gradientColors, children, showPlayButton, playButtonSize} = this.props
    const isVideo = this.hasVideo()
    const imageUrl = isVideo ? getImageUrl(cover, 'video') : getImageUrl(cover)

    return (
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={onPress}
      >
        <Image
          cached={true}
          resizeMode='cover'
          source={{uri: imageUrl}}
          style={{
            ...imageStyle,
            ...this._getWidthHeight(),
          }}
        >
          <LinearGradient
            locations={gradientLocations}
            colors={gradientColors}
            style={styles.gradient}
          >
            {children}
          </LinearGradient>
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
        </Image>
      </TouchableWithoutFeedback>
    )
  }

  _tapVideoWrapper() {
    const {onPress} = this.props


    // If the video is not playing, invoke the usual callback
    if ((!this.player || !this.player.getIsPlaying()) && onPress) {
      return this.props.onPress()
    }

    this.player.toggle()
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
    nextState.isMuted !== this.state.isMuted
  }

  /*
  Nota bene. We have two different ways to display the play button. One through the Video
  component and a second through the conditional renders we have below. This should be
  refactored
  */
  renderVideo() {
    return (
      <View style={this._getWidthHeight()}>
        <Video
          path={getVideoUrl(this.props.cover)}
          imgUrl={getImageUrl(this.props.cover, 'video')}
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
        {this.props.allowVideoPlay && !this.state.isPlaying && <PlayButton
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
    else if (this.hasVideo()) {
      if (this.props.allowVideoPlay && this.props.autoPlayVideo) coverType = 'video'
      else if (this.hasVideo()) coverType = 'videoThumbnail'
    }

    return (
      <View style={[styles.root, this.props.style]}>
        {this.hasVideo() && coverType === 'video' && this.renderVideo()}
        {(coverType === 'image' || coverType === 'videoThumbnail') && this.renderImage()}
        {!coverType &&
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

// Image needs to be able to mutate it so we need to give it the raw object
const imageStyle = {
  width: Metrics.screenWidth,
  flexDirection: "column",
  justifyContent: "flex-end",
  position: 'relative'
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
    marginTop: -30,
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
