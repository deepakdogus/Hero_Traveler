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

  renderItem = category => {
    const categoryUrl = getImageUrl(category.image, 'categoryThumbnail', {
      width: Metrics.screenWidth * (Metrics.feedMargin / 100) / 3 - 4,
      height: Metrics.screenWidth * (Metrics.feedMargin / 100) / 3 - 4,
    })

    return (
      <View key={category.id} style={styles.gridItem}>
        <ImageWrapper
          cached={false}
          background={true}
          source={{ uri: categoryUrl }}
          style={styles.gridImage}
          imageStyle={{ borderRadius: 6 }}
        >
          <TouchableWithoutFeedback onPress={this._onPress(category)}>
            <View style={styles.gridImage}>
              {category.selected && (
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
          {category.title || category.username}
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
