import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableWithoutFeedback } from 'react-native'

import styles from '../Containers/CreateStory/4_CreateStoryDetailScreenStyles'
import TabIcon from './TabIcon'

class EditCategoryHashtag extends Component {
  static propTypes = {
    text: PropTypes.string,
    tagName: PropTypes.string,
    onPress: PropTypes.func,
    mapFunction: PropTypes.func,
    iconStyle: PropTypes.object,
    array: PropTypes.array,
  }

  render () {
    const {text, onPress, iconStyle, array, mapFunction, tagName} = this.props
    return (
      <View style={styles.fieldWrapper}>
        <TabIcon name={tagName} style={iconStyle} />
        <TouchableWithoutFeedback
          onPress={onPress}
          style={styles.tagStyle}
        >
          <View>
            {_.size(array) > 0 &&
              <Text style={styles.tagStyleText}>
                { mapFunction(array) }
              </Text>
            }
            {_.size(array) === 0 &&
              <Text
                style={[
                  styles.tagStyleText,
                  styles.tagPlaceholder
                ]}
              >
                {text}
              </Text>
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default EditCategoryHashtag
