import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'

import NavBar from './CreateStory/NavBar'
import PhotoTaker from '../Components/PhotoTaker'
import Video from '../Components/Video'
import Image from '../Components/Image'
import styles from './Styles/MediaSelectorScreenStyles'
import isTooltipComplete, {Types as TooltipTypes} from '../Shared/Lib/firstTimeTooltips'
import UserActions from '../Shared/Redux/Entities/Users'
import { Colors } from '../Shared/Themes'

class MediaSelectorScreen extends React.Component {

  static propTypes = {
    onSelectMedia: PropTypes.func,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      captureOpen: true,
      media: null,
      mediaCaptured: false,
    }
  }

  launchMediaCapture = () => {
    this.setState({captureOpen: true, media: null})
  }

  launchMediaSelector = () => {
    this.setState({captureOpen: false})
    ImagePicker.launchImageLibrary({
      videoQuality: 'high',
      mediaType: 'mixed'
    }, this._handleMediaSelector)
  }

  _completePhotoTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.STORY_PHOTO_TAKE,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  _completeNextTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.STORY_PHOTO_NEXT,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  isCaptureInUse = () => {
    return this.state.captureOpen || this.state.mediaCaptured
  }

    renderPhotoTooltip() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 540,
          bottom: 0,
          left: 190,
          right: 0,
          backgroundColor: 'transparent',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={this._completePhotoTooltip}
      >
          <View style={{
            height: 38,
            width: 144,
            padding: 0,
            borderRadius: 5,
            backgroundColor: 'white',
            alignItems: 'center',
            shadowColor: 'black',
            shadowOpacity: .2,
            shadowRadius: 30
          }}>
            <Text style={{marginTop: 10}}>Tap to take a photo</Text>
          </View>
          <View style={{
            height: 0,
            width: 0,
            borderLeftWidth: 6,
            borderLeftColor: 'transparent',
            borderRightWidth: 6,
            borderRightColor: 'transparent',
            borderTopWidth: 6,
            borderTopColor: 'white',
          }}>
          </View>
      </TouchableOpacity>
    )
  }

    renderNextTooltip() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          bottom: 490,
          left: 220,
          right: 0,
          backgroundColor: 'transparent',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={this._completeNextTooltip}
      >
          <View style={{
            height: 0,
            width: 0,
            borderLeftWidth: 6,
            borderLeftColor: 'transparent',
            borderRightWidth: 6,
            borderRightColor: 'transparent',
            borderBottomWidth: 6,
            borderBottomColor: 'white',
            position: 'relative',
            left: 42,
          }}>
          </View>
          <View style={{
            height: 38,
            width: 124,
            padding: 0,
            borderRadius: 5,
            backgroundColor: 'white',
            alignItems: 'center',
            shadowColor: 'black',
            shadowOpacity: .2,
            shadowRadius: 30
          }}>
            <Text style={{marginTop: 10}}>Tap to continue</Text>
          </View>
      </TouchableOpacity>
    )
  }

  _retake = () => {
    this.setState({media: null})
  }

  getMediaType = () => {
    if (!this.state.media) return undefined
    const media = this.state.media.split('.')
    const extension = media[media.length-1]
    if (extension === 'MOV') return 'video'
    else return 'photo'
  }

  render () {
    let content
    let showPhotoTooltip = false;
    let showNextTooltip = false;
    const mediaType = this.getMediaType()
    if (this.props.user) {
      showPhotoTooltip = !isTooltipComplete(
        TooltipTypes.STORY_PHOTO_TAKE,
        this.props.user.introTooltips
      )
    }

    if (this.props.user && this.state.media) {
      showNextTooltip = !isTooltipComplete(
        TooltipTypes.STORY_PHOTO_NEXT,
        this.props.user.introTooltips
      )
    }

    if (this.state.captureOpen && !this.state.media) {
      content = (
        <PhotoTaker
          mediaType={this.props.mediaType}
          onCapture={this._handleCaptureMedia}
        />
      )
    } else if (this.state.media && mediaType === 'photo') {
      content = (
        <View style={styles.imageWrapper}>
          <Image
            source={{uri: this.state.media}}
            style={styles.image}
          />
          <View style={{flex: 1}} />
          {this.state.mediaCaptured &&
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={this._retake}
            >
              <Text style={styles.retakeButtonText}>RETAKE</Text>
            </TouchableOpacity>
          }
        </View>
      )
    } else if (this.state.media && mediaType === 'video') {
      content = (
        <View style={styles.imageWrapper}>
          <Video
            path={this.state.media}
            showMuteButton={false}
            autoPlayVideo={true}
            allowVideoPlay={true}
            showChangeBtn={!this.state.mediaCaptured}
            changeBtnOnPress={this.launchMediaSelector}
          />
          <View style={{flex: 1}} />
          {
            this.state.mediaCaptured &&
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={this._retake}
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
          onRight={this._onNext}
          isRightValid={this.state.media}
          rightIcon={this.props.rightIcon || 'arrowRightRed'}
          rightTitle={this.props.rightTitle}
          rightTextStyle={{paddingRight: this.props.rightIcon === 'none' ? 20 : 10}}
        />
        <View style={styles.root}>
          {content}
          <View style={styles.tabbar}>
            <TouchableOpacity
              style={styles.tabbarButton}
              onPress={this.launchMediaSelector}
            >
              <Text style={[
                styles.tabbarText,
                this.isCaptureInUse() ? { color: Colors.grey } : {}
              ]}>Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabbarButton}
              onPress={this.launchMediaCapture}
            >
              <Text style={[
                styles.tabbarText,
                this.isCaptureInUse() ? {} : { color: Colors.grey }
              ]}>Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
        {showPhotoTooltip && this.renderPhotoTooltip()}
        {showNextTooltip && this.renderNextTooltip()}
      </View>
    )
  }

  _handleMediaSelector = (data) => {
    if (data.didCancel) {
      this.setState({captureOpen: true})
      return;
    }

    if (data.error) {
      this.setState({captureOpen: true})
      return
    }

    this.setState({
      mediaCaptured: false,
      media: data.uri
    })
  }

  _handleCaptureMedia = (data) => {
    this.setState({
      mediaCaptured: true,
      media: data.path
    })
  }

  _onNext = () => {
    if (this.state.media) {
      const isPhotoType = this.getMediaType() === 'photo'
      this.props.onSelectMedia(this.state.media, isPhotoType)
    }
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
