import React, {Component} from 'react'
import {
  View,
  Text,
  ListView,
  TouchableOpacity,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import TabIcon from '../TabIcon'
import {Colors} from '../../Themes'
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
          source={{uri: getImageUrl(category.image) || undefined}}
          style={styles.gridImage}
        >
          <Text style={styles.gridRowText}>{category.title}</Text>
          {category.selected &&
            <TabIcon 
              name='redCheck'
              style={styles.selectedIcon}
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
