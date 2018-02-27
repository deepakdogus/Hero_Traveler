import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Text, TouchableOpacity, ProgressViewIOS, View} from 'react-native'
import styles from './Styles/ProgressBarStyles'
import {Colors} from '../Shared/Themes'
import TabIcon from './TabIcon'

class DrawerButton extends Component {
  static propTypes = {
    message: PropTypes.string,
    syncProgress: PropTypes.number,
    syncProgressSteps: PropTypes.number,
    error: PropTypes.bool,
    onPress: PropTypes.func,
  }

  render () {
    const {message, syncProgress, syncProgressSteps, error} = this.props
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[
          styles.container,
          error && styles.error
        ]}>
          <View style={styles.textWrapper}>
            {error && <TabIcon name='error' style={{image: styles.errorIcon}}/>}
            <Text style={styles.text}>
              {message}
              {error ? ": Error. You can retry from notifications" : ''}
              {syncProgress === syncProgressSteps ? ': Success. Press to dismiss' : ''}
            </Text>
          </View>
          {!error &&
            <ProgressViewIOS
              style={styles.bar}
              progress={syncProgress/syncProgressSteps}
              progressTintColor={Colors.redHighlights}
              trackTintColor={Colors.feedDividerGrey}
              progressViewStyle='bar'
            />
          }
        </View>
      </TouchableOpacity>
    )
  }
}

export default DrawerButton
