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
    iconStyle: PropTypes.object,
    array: PropTypes.array,
  }

  mapHashtags(hashtags) {
    return _.map(hashtags, (hashtag) => {
      return `#${hashtag.title}`
    }).join(', ')
  }

  mapCategories(categories) {
    return _.map(categories, 'title').join(', ')
  }

  render () {
    const {text, onPress, iconStyle, array, tagName} = this.props
    const mapFunction = tagName === 'hashtag' ? this.mapHashtags : this.mapCategories
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        style={styles.tagStyle}
      >
        <View style={styles.fieldWrapper}>
          <TabIcon name={tagName} style={iconStyle} />
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
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default EditCategoryHashtag
