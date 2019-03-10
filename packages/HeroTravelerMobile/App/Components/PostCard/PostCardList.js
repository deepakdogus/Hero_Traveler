import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, FlatList } from 'react-native'

import PostCardThumbnail from './PostCardThumbnail'

import styles from '../Styles/PostCardStyles'

export default class PostCardList extends Component {
  static propTypes = {
    entities: PropTypes.array,
  }

  _renderItem = ({item}) => (
    <PostCardThumbnail item={item} />
  )

  render() {
    const { entities } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={entities}
          horizontal={true}
          renderItem={this._renderItem}
          style={styles.listContainer}
        />
      </View>
    )
  }
}
