import React, {Component, PropTypes} from 'react'
import { View, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from './Styles/PhotoTakerStyles'

class PhotoTaker extends Component {
  static propTypes = {
    captureOptions: PropTypes.object,
    onTakePhoto: PropTypes.func.isRequired,
    onError: PropTypes.func
  }

  static defaultProps = {
    captureOptions: {},
  }

  _handleTakePhoto = () => {
    this.cameraRef.capture(this.props.captureOptions)
        .then(response => {
          this.props.onTakePhoto(response)
        })
      .catch(err => {
        console.log('error taking photo', err)
        if (this.props.onError) {
          this.props.onError(err)
        }
      })
  }

  render () {
    return (
      <Camera
        ref={(camera) => { this.cameraRef = camera }}
        captureTarget={Camera.constants.CaptureTarget.disk}
        keepAwake
        aspect={Camera.constants.Aspect.fill}
        style={styles.camera}
        onZoomChanged={() => null}
       >
        <View style={styles.cameraControls}>
          <View>
            <Icon name='bolt' size={30} />
          </View>
          <View style={{marginTop: 30}}>
            <Icon name='camera' size={30} />
          </View>
        </View>
        <View style={{flex: 1}} />
        <View style={styles.cameraShutterButton} >
          <TouchableOpacity
            touchableOpacity={0.2}
            onPress={this._handleTakePhoto}
          >
            <Icon name='circle-o' size={30} />
          </TouchableOpacity>
        </View>
      </Camera>
    )
  }
}

export default PhotoTaker
