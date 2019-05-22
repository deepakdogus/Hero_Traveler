import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { TAG_TYPE_HASHTAG, TAG_TYPE_USER } from '../Containers/CreateStory/TagScreen'
import { Colors, Metrics } from '../Shared/Themes/'

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
      <View key={tag._id} style={styles.rowWrapper}>
        <TouchableOpacity
          onPress={this._onPress}
          style={styles.row}
        >
          <Text>
            {tagType === TAG_TYPE_HASHTAG ? "#" : ""}
            {tagType === TAG_TYPE_USER ? tag.username : tag.title}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas
  },
})
