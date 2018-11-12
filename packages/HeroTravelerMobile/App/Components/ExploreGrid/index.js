import React, {Component} from 'react'
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
import {Metrics} from '../../Shared/Themes'

const noop = () => null

export default class ExploreGrid extends Component {

  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    onPress: PropTypes.func,
  }

  render() {
    return (
      <View
        style={styles.grid}
      >
        {this.props.categories.map(this.renderRow)}
      </View>
    )
  }

  renderRow = (category) => {
    const categoryUrl = getImageUrl(category.image, 'categoryThumbnail', {
      width: Metrics.screenWidth / 3 - 4,
      height: Metrics.screenWidth / 3 - 4,
    })

    return (
      <View key={category.id} style={styles.gridRow}>
        <ImageWrapper
          cached={false}
          background={true}
          source={{uri: categoryUrl}}
          style={styles.gridImage}
        >
          <TouchableWithoutFeedback
            onPress={this._onPress(category)}
            >
            <View style={styles.gridImage}>
              <Text style={styles.gridRowText}>{category.title}</Text>
              {category.selected &&
                <TabIcon
                  name='redCheckOutlined'
                  style={{view: styles.selectedIcon}}
                />
              }
            </View>
          </TouchableWithoutFeedback>
        </ImageWrapper>
      </View>
    )
  }

  _onPress = (category) => {
    const {onPress} = this.props
    if (onPress) return () => onPress(category)
    else return noop
  }
}
