import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Text, TouchableOpacity, ProgressViewIOS, View} from 'react-native'
import styles from './Styles/ProgressBarStyles'
import {Colors} from '../Shared/Themes'
import TabIcon from './TabIcon'

class ProgressBar extends Component {
  static propTypes = {
    message: PropTypes.string,
    syncProgress: PropTypes.number,
    syncProgressSteps: PropTypes.number,
    error: PropTypes.bool,
    onPress: PropTypes.func,
  }

  render() {
    const {message, syncProgress, syncProgressSteps, error} = this.props

    if (syncProgressSteps === 0 || syncProgressSteps === syncProgress || error) return null

    return (
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>
            {message}
            {syncProgress === syncProgressSteps ? ': Success. Press to dismiss' : ''}
          </Text>
        </View>
        <ProgressViewIOS
          style={styles.bar}
          progress={syncProgress/syncProgressSteps}
          progressTintColor={Colors.redHighlights}
          trackTintColor={Colors.feedDividerGrey}
          progressViewStyle='bar'
        />
      </View>
    )
  }
}

export default ProgressBar
