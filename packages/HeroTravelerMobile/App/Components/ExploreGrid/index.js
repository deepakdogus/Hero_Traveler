import React, {Component} from 'react'
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

export default class ExploreGrid extends Component {

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
    const categoryUrl = getImageUrl(category.image, 'optimized', {
      width: Metrics.screenWidth/3 - 4,
      height: Metrics.screenWidth/3 - 4,
    })

    return (
      <View key={category.id} style={styles.gridRow}>
        <TouchableWithoutFeedback
          onPress={() => this._onPress(category)}
        >
          <ImageWrapper
            cached={true}
            background={true}
            source={{uri: categoryUrl}}
            style={styles.gridImage}
          >
            <Text style={styles.gridRowText}>{category.title}</Text>
            {category.selected &&
              <TabIcon
                name='redCheck'
                style={{view: styles.selectedIcon}}
              />
            }
          </ImageWrapper>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  _onPress = (category) => {
    if (this.props.onPress) {
      this.props.onPress(category)
    }
  }
}
