import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

import TabIcon from '../TabIcon'
import ImageWrapper from '../ImageWrapper'
import styles from './ExploreGridStyles'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import { Metrics } from '../../Shared/Themes'

export default class ExploreGrid extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    onPress: PropTypes.func,
  }

  _onPress = category => {
    const { onPress } = this.props
    if (onPress) return () => onPress(category)
    else return null
  }

  renderItem = categoryOrChannel => {
    const image = categoryOrChannel.image || categoryOrChannel.channelImage.original.path
    const categoryOrChannelUrl = getImageUrl(image, 'categoryThumbnail', {
      width: Metrics.screenWidth * (Metrics.feedMargin / 100) / 3 - 4,
      height: Metrics.screenWidth * (Metrics.feedMargin / 100) / 3 - 4,
    })

    return (
      <View key={categoryOrChannel.id} style={styles.gridItem}>
        <ImageWrapper
          cached={false}
          background={true}
          source={{ uri: categoryOrChannelUrl }}
          style={styles.gridImage}
          imageStyle={{ borderRadius: 6 }}
        >
          <TouchableWithoutFeedback onPress={this._onPress(categoryOrChannel)}>
            <View style={styles.gridImage}>
              {categoryOrChannel.selected && (
                <TabIcon
                  name="redCheckOutlined"
                  style={{ view: styles.selectedIcon }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </ImageWrapper>
        <Text
          style={styles.gridItemText}
          numberOfLines={2}
          ellipsizeMode={'tail'}
          adjustsFontSizeToFit
          minimumFontScale={0.9}
        >
          {categoryOrChannel.title || categoryOrChannel.username}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.grid}>
        {this.props.categories.map(this.renderItem)}
      </View>
    )
  }
}
