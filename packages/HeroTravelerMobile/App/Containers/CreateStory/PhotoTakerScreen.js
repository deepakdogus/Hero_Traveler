import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { reduxForm } from 'redux-form'
// Styles
import styles from './PhotoTakerScreenStyles'

class PhotoTakerScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  _handleTakePhoto = () => {
    this.cameraRef.capture()
        .then(({ path }) => {
          this.props.change('coverPhoto', path)
          NavigationActions.pop()
        })
      .catch((err) => console.log(err))
  }

  render () {
    return (
      <View style={styles.containerWithNavbarAndTabbar}>
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
              onPress={this.handleTakePhoto}
            >
              <Icon name='circle-o' size={30} />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    )
  }
}

export default reduxForm({
  form: 'createStory',
  destroyOnUnmount: false
})(PhotoTakerScreen)
