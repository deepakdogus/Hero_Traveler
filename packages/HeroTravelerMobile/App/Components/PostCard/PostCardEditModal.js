'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'

import { Metrics } from '../../Shared/Themes/'
import BottomModal, { styles, visibleButtonHeight} from '../BottomModal'

const maxOffset = Metrics.tabBarHeight
  + 2 * visibleButtonHeight
  + 2 * Metrics.baseMargin

export default class PostCardEditModal extends Component {
  static propTypes = {
    flagStory: PropTypes.func,
    closeModal: PropTypes.func,
    showModal: PropTypes.bool,
  }

  render() {
    console.log("we have showModal of", this.props.showModal)
    return (
      <BottomModal
        {...this.props}
        maxOffset={maxOffset}
      >
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.props.flagStory}
        >
          <Text style={[styles.text]}>
            Edit Story
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.props.flagStory}
        >
          <Text style={[styles.text]}>
            Delete Story
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.props.closeModal}
        >
          <Text style={styles.text}>
            Cancel
          </Text>
        </TouchableOpacity>
      </BottomModal>
   )
  }
}
