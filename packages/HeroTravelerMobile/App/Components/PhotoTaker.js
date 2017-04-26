import React, {Component, PropTypes} from 'react'
import { View, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Colors} from '../Themes'
import styles from './Styles/PhotoTakerStyles'

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
      captureAudio: true
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

  hasFlash() {
    return this.cameraRef && this.cameraRef.hasFlash()
  }

  getCaptureMode() {
    return this.props.mediaType === 'photo' ?
      Camera.constants.CaptureMode.still : Camera.constants.CaptureMode.video
  }

  render () {
    return (
      <Camera
        ref={camera => this.cameraRef = camera}
        captureMode={this.getCaptureMode()}
        captureAudio={this.state.captureAudio}
        orientation={Camera.constants.Orientation.portrait}
        captureTarget={Camera.constants.CaptureTarget.disk}
        keepAwake={true}
        type={this.state.backCamera ? Camera.constants.Type.back : Camera.constants.Type.front}
        aspect={Camera.constants.Aspect.fill}
        style={styles.camera}
       >
        <View style={styles.cameraControls}>
          {this.hasFlash() &&
            <View style={[styles.cameraControl, styles.flash]}>
              <Icon
                color={Colors.snow}
                name='bolt'
                size={30} />
            </View>
          }
          <TouchableOpacity onPress={() => this.setState({backCamera: !this.state.backCamera})}>
            <View
              style={[styles.cameraControl, styles.flipCamera]}>
              <Icon
                color={Colors.snow}
                name='camera'
                size={30} />
            </View>
          </TouchableOpacity>
          {this.props.mediaType === 'video' &&
            <TouchableOpacity onPress={() => this.setState({captureAudio: !this.state.captureAudio})}>
              <View
                style={[styles.cameraControl, styles.flipCamera]}>
                <Icon
                  color={Colors.snow}
                  name={!this.state.captureAudio ? 'volume-off' : 'volume-up'}
                  size={30} />
              </View>
            </TouchableOpacity>
          }
        </View>
        <View style={{flex: 1}} />
        {this.props.mediaType === 'photo' &&
          <View style={styles.cameraShutterButton}>
            <TouchableOpacity
              touchableOpacity={0.2}
              onPress={this._handleTakePhoto}
            >
              <Icon
                color={Colors.snow}
                name='circle-o'
                size={50}/>
            </TouchableOpacity>
          </View>
        }
        {this.props.mediaType === 'video' &&
          <View style={styles.cameraShutterButton}>
            <TouchableOpacity
              touchableOpacity={0.2}
              onPress={!this.state.isRecording ? this._startRecordVideo : this._stopRecordVideo}
            >
              <Icon
                color={this.state.isRecording ? Colors.redLight : Colors.snow}
                name={this.state.isRecording ? 'circle' : 'circle-o'}
                size={50}/>
            </TouchableOpacity>
          </View>
        }
      </Camera>
    )
  }
}

export default PhotoTaker
