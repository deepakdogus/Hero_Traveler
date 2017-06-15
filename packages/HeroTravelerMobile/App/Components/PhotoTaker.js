import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Colors} from '../Themes'
import styles from './Styles/PhotoTakerStyles'
import TabIcon from './TabIcon'
import MediaCaptureButton from './MediaCaptureButton'

class PhotoTaker extends Component {
  static propTypes = {
    captureOptions: PropTypes.object,
    onCapture: PropTypes.func.isRequired,
    onError: PropTypes.func,
    mediaType: PropTypes.oneOf(['photo', 'video']).isRequired,
  }

  static defaultProps = {
    captureOptions: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      backCamera: true,
      isRecording: false,
      hasFlash: false,
    }
  }

  componentDidMount = () => {
    if (this.cameraRef) {
      this.cameraRef.hasFlash()
      .then((result) => {
        this.setState({hasFlash: result})
      })
    }
  }

  _handleTakePhoto = () => {
    this.cameraRef.capture()
        .then((response) => {
          this.props.onCapture(response)
        })
        .catch(err => {
          console.log('error taking photo', err)
          if (this.props.onError) {
            this.props.onError(err)
          }
        })
  }

  _startRecordVideo = () => {
    this.setState({
      isRecording: true
    })
    return this.cameraRef.capture({
      audio: true,
      mode: this.getCaptureMode()
    })
      .then((resp) => {
        this.props.onCapture(resp)
      })

  }

  _stopRecordVideo = () => {
    this.cameraRef.stopCapture()
    this.setState({isRecording: false})
  }

  getCaptureMode() {
    return this.props.mediaType === 'photo' ?
      Camera.constants.CaptureMode.still : Camera.constants.CaptureMode.video
  }

  _flipCamera = () => this.setState({backCamera: !this.state.backCamera})

  _cameraRef = camera => this.cameraRef = camera

  render () {
    return (
      <Camera
        ref={this._cameraRef}
        captureMode={this.getCaptureMode()}
        captureAudio={this.props.mediaType === 'video'}
        orientation={Camera.constants.Orientation.portrait}
        captureTarget={Camera.constants.CaptureTarget.disk}
        keepAwake={true}
        type={this.state.backCamera ? Camera.constants.Type.back : Camera.constants.Type.front}
        aspect={Camera.constants.Aspect.fill}
        style={styles.camera}
       >
        <View style={styles.cameraControls}>
          {this.props.mediaType === 'photo' && this.state.hasFlash &&
            <View style={[styles.cameraControl, styles.flash]}>
              <TabIcon name='cameraFlash' />
            </View>
          }
          <TouchableOpacity onPress={this._flipCamera}>
            <View
              style={[styles.cameraControl, styles.flipCamera]}>
              <TabIcon name='cameraReverse' style={{ image: { marginLeft: 3 } }}/>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}} />
        {this.props.mediaType === 'photo' &&
          <View style={styles.cameraShutterButton}>
            <TouchableOpacity
              touchableOpacity={0.2}
              onPress={this._handleTakePhoto}
            >
              <MediaCaptureButton />
            </TouchableOpacity>
          </View>
        }
        {this.props.mediaType === 'video' &&
          <View style={styles.cameraShutterButton}>
            <TouchableOpacity
              touchableOpacity={0.2}
              onPress={!this.state.isRecording ? this._startRecordVideo : this._stopRecordVideo}
            >
              <MediaCaptureButton isRecording={this.state.isRecording}/>

            </TouchableOpacity>
          </View>
        }
      </Camera>
    )
  }
}

export default PhotoTaker
