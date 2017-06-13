import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import TabIcon from '../TabIcon'
import Image from '../Image'
import styles from './ExploreGridStyles'
import getImageUrl from '../../Lib/getImageUrl'

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
    return (
      <TouchableOpacity
        onPress={() => this._onPress(category)}
        style={styles.gridRow}
        key={category.id}
      >
        <Image
          cached={true}
          source={{uri: getImageUrl(category.image, 'versions.thumbnail240.path')}}
          style={styles.gridImage}
        >
          <Text style={styles.gridRowText}>{category.title}</Text>
          {category.selected &&
            <TabIcon
              name='redCheck'
              style={{view: styles.selectedIcon}}
            />
          }
        </Image>
      </TouchableOpacity>
    )
  }

  _onPress = (category) => {
    if (this.props.onPress) {
      this.props.onPress(category)
    }
  }
}
