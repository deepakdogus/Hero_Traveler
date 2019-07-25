import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'

import NavBar from './CreateStory/NavBar'
import PhotoTaker from '../Components/PhotoTaker'
import VideoPlayer from '../Components/VideoPlayer'
import ImageWrapper from '../Components/ImageWrapper'
import ShadowButton from '../Components/ShadowButton'
import TabbarButton from '../Components/MediaSelectorTabbarButton'
import styles from './Styles/MediaSelectorScreenStyles'
import isTooltipComplete, {Types as TooltipTypes} from '../Shared/Lib/firstTimeTooltips'
import UserActions from '../Shared/Redux/Entities/Users'
import detailsStyles from './CreateStory/4_CreateStoryDetailScreenStyles'
import Tooltip from '../Components/Tooltip'

const VideoManager = NativeModules.VideoManager

class MediaSelectorScreen extends React.Component {

  static propTypes = {
    onSelectMedia: PropTypes.func,
    user: PropTypes.object,
    mediaType: PropTypes.oneOf(['photo', 'video']), // if mediaType we limit the image picker abilities
  }

  constructor(props) {
    super(props)
    this.state = {
      captureOpen: true,
      media: null,
      mediaCaptured: false,
      selectedMediaType: 'Photo',
    }
  }

  launchMediaCapture = (selectedMediaType) => {
    this.setState({ captureOpen: true, media: null, selectedMediaType })
  }

  launchMediaSelector = () => {
    this.setState({ captureOpen: false })
    ImagePicker.launchImageLibrary({
      videoQuality: 'high',
      mediaType: this.props.mediaType || 'mixed',
    }, this.handleUploadedMedia)
  }

  handleUploadedMedia = data => {
    if (data.didCancel) return this.launchMediaCapture('Photo')
    this.handleMediaSelector(data)
  }

  completeNextTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.STORY_PHOTO_NEXT,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  isCaptureInUse = mediaType => {
    return (this.state.captureOpen || this.state.mediaCaptured)
      && (!mediaType || mediaType === this.state.selectedMediaType)
  }

  renderNextTooltip() {
    return (
      <Tooltip
        text='Tap to continue'
        position='right-nav-button'
        onDismiss={this.completeNextTooltip}
      />
    );
  }

  retake = () => {
    this.setState({media: null})
  }

  // Response from picking from the library
  handleMediaSelector = (data) => {
    if (data.didCancel) {
      this.setState({captureOpen: true})
      return;
    }

    if (data.error) {
      this.setState({
        libraryNotAuthorized: true,
        captureOpen: false
      })
      return
    }

    const updateState = {
      mediaCaptured: false,
      media: data.uri,
      mediaMetrics: {
      }
    }

    VideoManager.getWidthAndHeight(data)
      .then(response => {
        console.log({response})
        this.setState({
          ...updateState,
          mediaMetrics: {
            height: response.height,
            width: response.width,
          }
        })
      })
      .catch(err => {
        // Failing to get width/height is rare, and shouldn't stop being able to upload it
        // Only a few UI elements would look wrong
        this.setState(updateState)
      })

  }

  // Handle the response from taking a photo or video
  handleCaptureMedia = (data) => {
    this.setState({
      mediaCaptured: true,
      media: data.uri,
      mediaMetrics: {
        height: data.height,
        width: data.width,
      },
    })
  }

  onNext = () => {
    if (this.state.media) {
      const isPhotoType = this.getMediaType() === 'photo'
      this.props.onSelectMedia(this.state.media, isPhotoType, this.state.mediaMetrics)
    }
  }

  getMediaType = () => {
    if (!this.state.media) return undefined
    const media = this.state.media.split('.')
    const extension = media[media.length-1]
    if (extension.toUpperCase() === 'MOV') return 'video'
    else return 'photo'
  }

  closeError = () => {
    this.setState({error: undefined})
  }

  navToSettings = () => {
    this.setState({libraryNotAuthorized: false});
    Linking.openURL('app-settings:');
  }

  getIsPhotoType() {
    if (this.props.mediaType) return this.props.mediaType === 'photo'
    else return this.state.selectedMediaType === 'Photo'
  }

  render () {
    const {error, libraryNotAuthorized, captureOpen} = this.state
    let content
    let showNextTooltip = false;
    const mediaType = this.getMediaType()
    if (this.props.user && this.state.media) {
      showNextTooltip = !isTooltipComplete(
        TooltipTypes.STORY_PHOTO_NEXT,
        this.props.user.introTooltips
      )
    }
    if (captureOpen && !this.state.media) {
      content = (
        <PhotoTaker
          mediaType={this.props.mediaType}
          isPhotoType={this.getIsPhotoType()}
          onCapture={this.handleCaptureMedia}
          ref={this.setPhotoTakerRef}
        />
      )
    } else if (this.state.media && mediaType === 'photo') {
      content = (
        <View style={styles.imageWrapper}>
          <ImageWrapper
            source={{uri: this.state.media}}
            style={styles.image}
          />
          <View style={{flex: 1}} />
          {this.state.mediaCaptured &&
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={this.retake}
            >
              <Text style={styles.retakeButtonText}>RETAKE</Text>
            </TouchableOpacity>
          }
        </View>
      )
    } else if (this.state.media && mediaType === 'video') {
      content = (
        <View style={styles.imageWrapper}>
          <VideoPlayer
            path={this.state.media}
            showMuteButton={false}
            showPlayButton={false}
            autoPlayVideo={false}
            allowVideoPlay={false}
            showChangeBtn={!this.state.mediaCaptured}
            changeBtnOnPress={this.launchMediaSelector}
            showControls={false}
          />
          <View style={{flex: 1}} />
          {
            this.state.mediaCaptured &&
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={this.retake}
            >
              <Text style={styles.retakeButtonText}>RETAKE</Text>
            </TouchableOpacity>
          }
        </View>
      )
    }

    return (
      <View style={{flex: 1}}>
        <NavBar
          onLeft={this.props.onLeft}
          leftTitle={this.props.leftTitle}
          leftTextStyle={this.props.leftTextStyle}
          title={this.props.title}
          titleStyle={this.props.titleStyle}
          onRight={this.onNext}
          isRightValid={!!this.state.media}
          rightIcon={this.props.rightIcon || 'arrowRightRed'}
          rightTitle={this.props.rightTitle}
          rightTextStyle={this.props.rightIcon === 'none' ? styles.rightTextNoIcon : styles.rightTextWithIcon}
        />
        <View style={styles.root}>
          {error &&
            <ShadowButton
              style={detailsStyles.errorButton}
              onPress={this.closeError}
              text={error.toString().substring(7)}
              title={'Media Load Failure'}
            />
          }
          {libraryNotAuthorized && !captureOpen &&
            <View style={[styles.notAuthorizedWrapper]}>
            <TouchableOpacity
              onPress={this.navToSettings}
            >
              <Text style={[styles.notAuthorizedText]}>Access to your photo library is currently disabled.{"\n"}Tap here to update your settings.</Text>
              </TouchableOpacity>
            </View>
          }
          {content}
          <View style={styles.tabbar}>
            <TabbarButton
              onPress={this.launchMediaSelector}
              isActive={!this.isCaptureInUse()}
              text={'Library'}
            />
            {!this.props.mediaType &&
              <TabbarButton
                onPress={this.launchMediaCapture}
                isActive={this.isCaptureInUse('Photo')}
                text={'Photo'}
              />
            }
            {!this.props.mediaType &&
              <TabbarButton
                onPress={this.launchMediaCapture}
                isActive={this.isCaptureInUse('Video')}
                text={'Video'}
              />
            }
            {this.props.mediaType &&
              <TabbarButton
                onPress={this.launchMediaCapture}
                isActive={this.isCaptureInUse()}
                text={'Capture'}
              />
            }
          </View>
        </View>
        {showNextTooltip && this.renderNextTooltip()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.entities.users.entities[state.session.userId]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaSelectorScreen)
