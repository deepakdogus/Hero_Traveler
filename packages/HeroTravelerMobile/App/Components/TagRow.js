import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import { TAG_TYPE_HASHTAG } from '../Containers/CreateStory/TagScreen'
import tagScreenStyles from '../Containers/CreateStory/TagScreenStyles'

export default class TagRow extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    tag: PropTypes.object,
    tagType: PropTypes.string,
  }

  _onPress = () => {
    const {onPress, tag} = this.props
    onPress(tag)
  }

  render() {
    const {tag, tagType} = this.props
    return (
      <View key={tag._id} style={tagScreenStyles.rowWrapper}>
        <TouchableOpacity
          onPress={this._onPress}
          style={tagScreenStyles.row}
        >
          <Text>
            {tagType === TAG_TYPE_HASHTAG ? "#" : ""}{tag.title}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
