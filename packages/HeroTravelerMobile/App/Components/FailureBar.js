import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Text, TouchableOpacity, View} from 'react-native'
import Immutable from 'seamless-immutable'

import styles from './Styles/BackgroundPublishingBarsStyles'
import TabIcon from './TabIcon'

const RetryButton = ({text, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.text, styles.retryText]}>
      {text}
    </Text>
  </TouchableOpacity>
)

class FailureBar extends Component {
  static propTypes = {
    failure: PropTypes.object,
    updateDraft: PropTypes.func,
    saveLocalDraft: PropTypes.func,
    discardUpdate: PropTypes.func,
  }

  retry = () => {
    const {story, failedMethod} = this.props.failure
    this.props[failedMethod](Immutable.asMutable(story, {deep: true}))
  }

  discard = () => {
    const {story} = this.props.failure
    this.props.discardUpdate(story.id)
  }

  render () {
    const {failure} = this.props

    return (
      <View style={[
        styles.container,
        styles.error,
      ]}>
        <View style={[
          styles.textWrapper,
          styles.failureWrapper,
        ]}>
          <View style={styles.description}>
            <TabIcon name="error" style={{image: styles.errorIcon}}/>
            <Text style={styles.text}>
              {failure.error} "{failure.story.title}". Retry?
            </Text>
          </View>
          <View style={styles.retryButtons}>
            <RetryButton text='YES' onPress={this.retry} />
            <RetryButton text='NO' onPress={this.discard} />
          </View>
        </View>
      </View>
    )
  }
}

export default FailureBar
