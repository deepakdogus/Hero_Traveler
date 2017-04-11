import React, {Component, PropTypes} from 'react'
import { View, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Colors} from '../Themes'
import styles from './Styles/PhotoTakerStyles'

class PhotoTaker extends Component {
  static propTypes = {
    captureOptions: PropTypes.object,
    onTakePhoto: PropTypes.func.isRequired,
    onError: PropTypes.func
  }

  static defaultProps = {
    captureOptions: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      backCamera: true
    }
  }

  _handleTakePhoto = () => {
    this.cameraRef.capture()
        .then((response) => {
          this.props.onTakePhoto(response)
        })
        .catch(err => {
          console.log('error taking photo', err)
          if (this.props.onError) {
            this.props.onError(err)
          }
        })
  }

  hasFlash() {
    return this.cameraRef && this.cameraRef.hasFlash()
  }

  render () {
    return (
      <Camera
        ref={(camera) => { this.cameraRef = camera }}
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
          <View
            style={[styles.cameraControl, styles.flipCamera]}>
            <Icon
              color={Colors.snow}
              name='camera'
              size={30} />
          </View>
        </View>
        <View style={{flex: 1}} />
        <View style={styles.cameraShutterButton} >
          <TouchableOpacity
            touchableOpacity={0.2}
            onPress={this._handleTakePhoto}
          >
            <Icon
              color={Colors.snow}
              name='circle-o'
              size={50} />
          </TouchableOpacity>
        </View>
      </Camera>
    )
  }
}

export default PhotoTaker
