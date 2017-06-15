import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

import {Colors} from '../Themes'

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
  }
})

export default class MediaCaptureButton extends Component {

  static propTypes = {
    isRecording: PropTypes.bool
  }

  render() {
    const { isRecording } = this.props

    return (
      <View style={ styles.circleDefault }>
        <View style={[ styles.circleDefault, styles.blackInnerCircle ]}>
          <View style={[ styles.circleDefault, styles.whiteInnerCircle, isRecording ? styles.redLight : {} ]}/>
        </View>
      </View>
    )
  }
}
