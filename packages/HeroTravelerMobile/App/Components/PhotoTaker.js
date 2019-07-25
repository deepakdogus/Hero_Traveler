import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, TouchableOpacity, Animated, Easing, Text, Linking} from 'react-native'
import { RNCamera } from 'react-native-camera'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'

import {Metrics} from '../Shared/Themes'
import styles from './Styles/PhotoTakerStyles'
import TabIcon from './TabIcon'
import MediaCaptureButton from './MediaCaptureButton'

const flashModes = {
  on: RNCamera.Constants.FlashMode.on,
  off: RNCamera.Constants.FlashMode.off,
}

class PhotoTaker extends Component {
  static propTypes = {
    captureOptions: PropTypes.object,
    onCapture: PropTypes.func.isRequired,
    onError: PropTypes.func,
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
      flashMode: flashModes.off,
      videoAnim: new Animated.Value(0),
      time: 0,
    }
  }

  takePicture = async () => {
    if (this.camera) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        this.props.onCapture(data)
      } catch (e) {
        console.error(e)
      }
    }
  }

  takeVideo = async () => {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync({
          mute: false,
          maxDuration: 60,
        })
        if (promise) {
          this.setState({ isRecording: true })
          this.displayRecordingProgress()
          const data = await promise
          this.props.onCapture(data)
          this.setState({ isRecording: false })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  tick(elapsedTime) {
    if (elapsedTime >= this.props.maxVideoLength * 1000) {
      return this.setState({time: this.props.maxVideoLength})
    }
    this.setState({time: elapsedTime})
  }

  getElapsedTime = () => ((Date.now() - this.startTime) / 1000).toFixed(1)

  displayRecordingProgress = () => {
    this.startTime = Date.now()
    this.tick((0).toFixed(1))
    this._interval = this.setInterval(() => {
      this.tick(this.getElapsedTime())
    }, 100)
    // resetting all timing to 0
    this.state.videoAnim.setValue(0)
    Animated.timing(
      this.state.videoAnim,
      {
        toValue: Metrics.screenWidth,
        easing: Easing.linear,
        duration: this.props.maxVideoLength * 1000
      }
    ).start(() => {
      this.clearInterval(this._interval)
      if (this.camera) this.camera.stopRecording()
    })
  }

  displayTime = () => this.state.time !== 0

  flipCamera = () => this.setState({backCamera: !this.state.backCamera})

  setupCamera = camera => this.camera = camera

  toggleIsPhotoType = () => this.setState({isPhotoType: !this.props.isPhotoType})

  toggleFlash = () => {
    const { flashMode } = this.state
    if (flashMode === flashModes.on) return this.setState({flashMode: flashModes.off})
    this.setState({flashMode: flashModes.on})
  }

  renderFlashButton = () => {
    const { flashMode } = this.state
    const name = flashMode === flashModes.on ? 'cameraFlashOn' : 'cameraFlash'
    return (
      <View style={[styles.cameraControl, styles.flash]}>
        <TouchableOpacity
          touchableOpacity={0.2}
          onPress={this.toggleFlash}
        >
          <TabIcon name={name} />
        </TouchableOpacity>
      </View>
    )
  }

  renderCaptureButton = () => {
    const { isRecording } = this.state
    const { isPhotoType } = this.props
    let onPress = isPhotoType ? this.takePicture : this.takeVideo
    return (
      <View style={styles.cameraShutterButton}>
        <TouchableOpacity
          touchableOpacity={0.2}
          onPress={onPress}
        >
          <MediaCaptureButton
            isVideo={!isPhotoType}
            isRecording={isRecording}
          />
        </TouchableOpacity>
      </View>
    )
  }

  navToSettings = () => Linking.openURL('app-settings:')

  notAuthorizedView = (
    <View style={[styles.notAuthorizedWrapper]}>
      <TouchableOpacity
        onPress={this.navToSettings}
      >
        <Text style={[styles.notAuthorizedText]}>Access to your camera is currently disabled.{"\n"}Tap here to update your settings.</Text>
      </TouchableOpacity>
    </View>
  )

  render () {
    const {isRecording, backCamera, time, flashMode, videoAnim} = this.state
    const {isPhotoType} = this.props
    return (
      <RNCamera
        ref={this.setupCamera}
        flashMode={flashMode}
        type={backCamera ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
        style={styles.camera}
        notAuthorizedView={this.notAuthorizedView}
       >
        {({ status }) => {
          if (status !== 'READY') return null // @TODO can return loading comp here
          return (
            <>
              {!isPhotoType && (
                <View style={styles.videoProgressWrapper}>
                  <Animated.View style={{
                    width: videoAnim,
                    height: 18
                  }}>
                    <View style={styles.videoProgressBar} />
                  </Animated.View>
                  {this.displayTime() && (
                    <View style={styles.videoProgressTextWrapper}>
                      <Text style={styles.videoProgressText}>{time}s</Text>
                    </View>
                  )}
                </View>
              )}
              <View style={styles.leftCameraControls}>
                {isPhotoType && this.renderFlashButton()}
                {!isRecording && !time && (
                  <TouchableOpacity onPress={this.flipCamera}>
                    <View
                      style={[styles.cameraControl, styles.flipCamera]}>
                      <TabIcon name='cameraReverse' style={{ image: { marginLeft: 3 } }}/>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{flex: 1}} />
              {this.renderCaptureButton()}
            </>
          )}}
      </RNCamera>
    )
  }
}

reactMixin(PhotoTaker.prototype, TimerMixin)

export default PhotoTaker
