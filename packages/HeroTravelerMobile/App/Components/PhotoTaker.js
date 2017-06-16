import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, TouchableOpacity, Animated, Easing, Text} from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'

import {Colors} from '../Themes'
import styles from './Styles/PhotoTakerStyles'
import TabIcon from './TabIcon'
import MediaCaptureButton from './MediaCaptureButton'
import Metrics from '../Themes/Metrics'

class PhotoTaker extends Component {
  static propTypes = {
    captureOptions: PropTypes.object,
    onCapture: PropTypes.func.isRequired,
    onError: PropTypes.func,
    mediaType: PropTypes.oneOf(['photo', 'video']).isRequired,
    maxVideoLength: PropTypes.number
  }

  static defaultProps = {
    captureOptions: {},
    maxVideoLength: 60
  }

  constructor(props) {
    super(props)
    this.state = {
      backCamera: true,
      isRecording: false,
      hasFlash: false,
      videoAnim: new Animated.Value(0),
      time: 0
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
          if (this.props.onError) {
            this.props.onError(err)
          }
        })
  }

  tick(elapsedTime) {
    if (elapsedTime >= this.props.maxVideoLength * 1000) {
      return this.setState({time: this.props.maxVideoLength})
    }
    this.setState({time: elapsedTime})
  }


  getElapsedTime() {
    return ((Date.now() - this.startTime) / 1000).toFixed(1)
  }

  _startRecordVideo = () => {
    this.setState({
      isRecording: true
    }, () => {
      this.startTime = Date.now()
      this.tick((0).toFixed(1))
      this._interval = this.setInterval(() => {
        this.tick(this.getElapsedTime())
      }, 100)
      Animated.timing(
        this.state.videoAnim,
        {
          toValue: Metrics.screenWidth,
          easing: Easing.linear,
          duration: this.props.maxVideoLength * 1000
        }
      ).start(() => {
        this.clearInterval(this._interval)
        this._stopRecordVideo()
      })
      return this.cameraRef.capture({
        audio: true,
        mode: this.getCaptureMode()
      })
        .then((resp) => {
          this.props.onCapture(resp)
        })
    })
  }

  _stopRecordVideo = () => {
    this.state.videoAnim.stopAnimation()
    this.cameraRef.stopCapture()
    this.setState({isRecording: false})
  }

  hasFlash() {
    return this.cameraRef && this.cameraRef.hasFlash()
  }

  isVideo() {
    return this.props.mediaType === 'video'
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
        {this.isVideo() && this.state.isRecording &&
          <View style={styles.videoProgressWrapper}>
            <Animated.View style={{
              width: this.state.videoAnim,
              height: 18
            }}>
              <View style={styles.videoProgressBar} />
            </Animated.View>
            <View style={styles.videoProgressTextWrapper}>
              <Text style={styles.videoProgressText}>{this.state.time}s</Text>
            </View>
          </View>
        }
        <View style={styles.cameraControls}>
          {this.props.mediaType === 'photo' && this.state.hasFlash &&
            <View style={[styles.cameraControl, styles.flash]}>
              <TabIcon name='cameraFlash' />
            </View>
          }
          {!this.state.isRecording &&
            <TouchableOpacity onPress={this._flipCamera}>
              <View
                style={[styles.cameraControl, styles.flipCamera]}>
                <TabIcon name='cameraReverse' style={{ image: { marginLeft: 3 } }}/>
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

reactMixin(PhotoTaker.prototype, TimerMixin)

export default PhotoTaker
