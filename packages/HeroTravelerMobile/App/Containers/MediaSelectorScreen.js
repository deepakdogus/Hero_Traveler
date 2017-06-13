import _ from 'lodash'
import React, { PropTypes } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'

import NavBar from './CreateStory/NavBar'
import PhotoTaker from '../Components/PhotoTaker'
import { Colors } from '../Themes'
import Video from '../Components/Video'
import styles from './Styles/MediaSelectorScreenStyles'
import isTooltipComplete, {Types as TooltipTypes} from '../Lib/firstTimeTooltips'
import UserActions from '../Redux/Entities/Users'

class MediaSelectorScreen extends React.Component {

  static propTypes = {
    mediaType: PropTypes.oneOf(['photo', 'video']).isRequired,
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

  launchMediaCapture() {
    this.setState({captureOpen: true, media: null})
  }

  launchMediaSelector() {
    this.setState({captureOpen: false})
    ImagePicker.launchImageLibrary({
      videoQuality: 'high',
      mediaType: this.props.mediaType
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


  render () {
    let content

    let showPhotoTooltip = false;
    let showNextTooltip = false;

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
    } else if (this.state.media && this.props.mediaType === 'photo') {
      content = (
        <View style={styles.imageWrapper}>
          <Image source={{uri: this.state.media}} style={styles.image} />
          <View style={{flex: 1}} />
          {this.state.mediaCaptured &&
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => this.setState({media: null})}
            >
              <Text style={styles.retakeButtonText}>RETAKE</Text>
            </TouchableOpacity>
          }
        </View>
      )
    } else if (this.state.media && this.props.mediaType === 'video') {
      content = (
        <View style={styles.imageWrapper}>
          <Video
            path={this.state.media}
            showMuteButton={false}
            autoPlayVideo={true}
            allowVideoPlay={true}

          />
          <View style={{flex: 1}} />
          {this.state.mediaCaptured &&
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => this.setState({media: null})}
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
          title={this.props.title}
          onLeft={this.props.onLeft}
          leftTitle={this.props.leftTitle}
          onRight={this._onNext}
          rightTitle={this.props.rightTitle}
          rightTextStyle={!this.state.media ? {opacity: .5} : {color: Colors.red}}
          rightIcon={!this.state.media ? null : 'arrowRightRed'}
          rightIconStyle={{image: { height: 12, width: 12, marginLeft: -10, marginRight: 12}}}
        />
        <View style={styles.root}>
          {content}
          <View style={styles.tabbar}>
            <TouchableOpacity
              style={styles.tabbarButton}
              onPress={() => this.launchMediaSelector()}
            >
              <Text style={[styles.tabbarText, styles.tabbarTextNotSelected]}>Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabbarButton}
              onPress={() => this.launchMediaCapture()}
            >
              <Text style={styles.tabbarText}>{this.props.mediaType === 'photo' ? 'Photo' : 'Video'}</Text>
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
      this.props.onSelectMedia(this.state.media)
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
