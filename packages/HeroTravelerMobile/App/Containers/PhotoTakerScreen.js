import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Svg, { Circle, Polygon } from 'react-native-svg'
import { reduxForm } from 'redux-form'
// Styles
import styles from './Styles/PhotoTakerScreenStyles'

class PhotoTakerScreen extends React.Component {
  constructor (props) {
    super(props)
    this.handleTakePhoto = this.handleTakePhoto.bind(this)
    this.state = {}
  }

  handleTakePhoto () {
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
              <Svg
                height='30'
                width='30'
              >
                <Polygon
                  points='1,1 29,1 15,29'
                  stroke='white'
                  fill='transparent'
                  strokeWidth='2'
                  />
              </Svg>
            </View>
            <View style={{marginTop: 30}}>
              <Svg
                height='30'
                width='30'
              >
                <Circle
                  cx='15'
                  cy='15'
                  r='13'
                  stroke='white'
                  fill='transparent'
                  strokeWidth='2'
                />
              </Svg>
            </View>
          </View>
          <View style={{flex: 1}} />
          <View style={styles.cameraShutterButton} >
            <TouchableOpacity
              touchableOpacity={0.2}
              onPress={this.handleTakePhoto}
            >
              <Svg
                height='80'
                width='80'
              >
                <Circle
                  cx='40'
                  cy='40'
                  r='40'
                  fill='white'
                />
                <Circle
                  cx='40'
                  cy='40'
                  r='33'
                  stroke='black'
                  strokeWidth='2'
                  fill='white'
                />
              </Svg>
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

