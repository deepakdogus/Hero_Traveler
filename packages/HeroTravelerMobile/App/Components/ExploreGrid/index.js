import React, {Component} from 'react'
import {
  View,
  Text,
  ListView,
  TouchableOpacity,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'

import {Colors} from '../../Themes'
import styles from './ExploreGridStyles'

function getUrl(categoryImage) {
  return `https://s3.amazonaws.com/hero-traveler/${categoryImage.path}${categoryImage.filename}`
}

export default class ExploreGrid extends Component {

  constructor(props) {
    super(props)
    // const rowHasChanged = (r1, r2) => {
    //   console.log('row has changed', rowHasChanged)
    //   return _.isEqual(r1, r2)
    // }
    // const ds = new ListView.DataSource({rowHasChanged})
    // this.data = ds.cloneWithRows(props.categories)
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
    return (
      <TouchableOpacity
        onPress={() => this._onPress(category)}
        style={styles.gridRow}
        key={category._id}
      >
        <Image
          source={{uri: getUrl(category.image.versions.thumbnail240)}}
          style={styles.gridImage}
        >
          <Text style={styles.gridRowText}>{category.title}</Text>
          {category.selected &&
            <Icon
              style={styles.selectedIcon}
              size={20}
              name='check-circle-o'
              color={Colors.red} />
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
