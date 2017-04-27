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
import Video from '../Components/Video'
import styles from './Styles/MediaSelectorScreenStyles'

class MediaSelectorScreen extends React.Component {

  static propTypes = {
    mediaType: PropTypes.oneOf(['photo', 'video']).isRequired,
    onSelectMedia: PropTypes.func
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

  render () {
    let content

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
            autoPlayVideo={false}
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
          rightTextStyle={!this.state.media ? {opacity: .5} : {}}
        />
        <View style={styles.root}>
          {content}
          <View style={styles.tabbar}>
            <TouchableOpacity
              style={styles.tabbarButton}
              onPress={() => this.launchMediaSelector()}
            >
              <Text style={styles.tabbarText}>Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabbarButton}
              onPress={() => this.launchMediaCapture()}
            >
              <Text style={styles.tabbarText}>{this.props.mediaType === 'photo' ? 'Photo' : 'Video'}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaSelectorScreen)
