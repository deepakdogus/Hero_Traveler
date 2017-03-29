import React, { PropTypes } from 'react'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'

import PhotoTaker from '../Components/PhotoTaker'
import styles from './Styles/MediaSelectorScreenStyles'

class MediaSelectorScreen extends React.Component {

  static propTypes = {
    mediaType: PropTypes.oneOf(['photo', 'video']).isRequired,
    onSelectMedia: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      captureOpen: true
    }
  }

  launchMediaCapture() {
    this.setState({captureOpen: true})
  }

  launchMediaSelector() {
    this.setState({captureOpen: false})
    ImagePicker.launchImageLibrary({
      mediaType: this.props.mediaType
    }, this._handleMediaSelector)
  }

  render () {
    let content

    if (this.state.captureOpen && this.props.mediaType === 'photo') {
      content = (
        <PhotoTaker
          onTakePhoto={this._handleCaptureMedia}
        />
      )
    }

    return (
      <View style={[styles.containerWithNavbar, styles.root]}>
        {content}
        <View style={styles.tabbar}>
          <TouchableOpacity onPress={() => this.launchMediaSelector()}>
            <Text style={styles.tabbarText}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.launchMediaCapture()}>
            <Text style={styles.tabbarText}>{this.props.mediaType === 'photo' ? 'Photo' : 'Video'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _handleMediaSelector = (data) => {
    console.log('MediaSelectorScreen _handleMediaSelector', data)

    if (data.didCancel) {
      this.setState({captureOpen: true})
      return;
    }

    if (data.error) {
      console.log('ERROR', data.error)
      this.setState({captureOpen: true})
      return
    }

    this.props.onSelectMedia(data.uri)
  }

  _handleCaptureMedia = (data) => {
    console.log('media captured', data)
    this.props.onSelectMedia(data.path)
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
