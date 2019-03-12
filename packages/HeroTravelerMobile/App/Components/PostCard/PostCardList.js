import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, FlatList } from 'react-native'

import PostCardThumbnail from './PostCardThumbnail'

import styles from '../Styles/PostCardStyles'

export default class PostCardList extends Component {
  static propTypes = {
    entities: PropTypes.array,
  }

  renderItem = ({item}) => (
    <PostCardThumbnail postcard={item} />
  )

  render() {
    const { entities } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={entities}
          horizontal={true}
          renderItem={this.renderItem}
          style={styles.listContainer}
        />
      </View>
    )
  }
}
