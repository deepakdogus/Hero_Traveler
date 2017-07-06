import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

import {Colors} from '../Shared/Themes'

const styles = StyleSheet.create({
  circleDefault: {
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 75,
  },
  blackInnerCircle: {
    backgroundColor: 'black',
    width: 60,
    height: 60,
  },
  whiteInnerCircle: {
    width: 55,
    height: 55,
  },
  redLight: {
    backgroundColor: Colors.redLight,
  },
  recordingCircle: {
    backgroundColor: Colors.redLight,
    width: 35,
    height: 35,
    borderRadius: 10,
  },
})

export default class MediaCaptureButton extends Component {

  static propTypes = {
    isRecording: PropTypes.bool,
    isVideo: PropTypes.bool,
  }

  render() {
    const { isRecording, isVideo } = this.props
    let innerStyle = {}
    if (isVideo) innerStyle = isRecording ? styles.recordingCircle : styles.redLight
    else innerStyle = {}
    return (
      <View style={ styles.circleDefault }>
        <View style={[ styles.circleDefault, styles.blackInnerCircle ]}>
          <View style={[ styles.circleDefault, styles.whiteInnerCircle, innerStyle]}/>
        </View>
      </View>
    )
  }
}
