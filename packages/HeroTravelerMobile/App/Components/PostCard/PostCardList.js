import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, FlatList } from 'react-native'
import PostCardThumbnail from './PostCardThumbnail'

import styles from '../Styles/PostCardStyles'

export default class PostCardList extends Component {
  static propTypes = {
    postcards: PropTypes.array,
    getPostcards: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { getPostcards } = this.props

    if (getPostcards) {
      getPostcards()
    }
  }

  renderItem = ({item}) => (
    <PostCardThumbnail postcard={item} />
  )

  render() {
    const { postcards } = this.props

    return (
      <View style={styles.container}>
        <FlatList
          data={postcards}
          horizontal={true}
          renderItem={this.renderItem}
          style={styles.listContainer}
        />
      </View>
    )
  }
}
