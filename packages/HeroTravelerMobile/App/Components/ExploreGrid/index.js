import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import _ from 'lodash'
import TabIcon from '../TabIcon'
import ImageWrapper from '../ImageWrapper'
import styles from './ExploreGridStyles'
import getItemUrl from '../../Shared/Lib/getImageUrl'
import { GRID_ITEM_DIMENSION } from './ExploreGridStyles'

export default class ExploreGrid extends Component {
  static propTypes = {
    exploreItems: PropTypes.arrayOf(PropTypes.object),
    isChannel: PropTypes.bool,
    onPress: PropTypes.func,
  }

  onPress = exploreItem => {
    const { onPress } = this.props
    if (onPress) return () => onPress(exploreItem)
    else return null
  }

  renderItem = exploreItem => {
    const { isChannel } = this.props
    const image
      = exploreItem.image || _.get(exploreItem, 'channelImage.original.path')

    const exploreItemUrl = getItemUrl(image, 'gridItemThumbnail', {
      width: isChannel ? null : GRID_ITEM_DIMENSION - 4,
      height: GRID_ITEM_DIMENSION - 4,
    })

    return (
      <View key={exploreItem.id} style={styles.gridItem}>
        <TouchableWithoutFeedback onPress={this.onPress(exploreItem)}>
          <View style={styles.gridImage}>
            <ImageWrapper
              cached={false}
              background={true}
              source={{ uri: exploreItemUrl }}
              style={
                isChannel ? styles.channelGridImage : styles.categoryGridImage
              }
              imageStyle={{ borderRadius: 6 }}
            >
              {exploreItem.selected && (
                <TabIcon
                  name="redCheckOutlined"
                  style={{ view: styles.selectedIcon }}
                />
              )}
            </ImageWrapper>
            {isChannel && (
              <Text
                style={styles.gridItemText}
                numberOfLines={2}
                ellipsizeMode={'tail'}
                adjustsFontSizeToFit
                minimumFontScale={0.9}
              >
                {exploreItem.title}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.grid}>
        {this.props.exploreItems.map(this.renderItem)}
      </View>
    )
  }
}
