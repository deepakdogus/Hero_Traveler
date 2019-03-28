import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, FlatList } from 'react-native'
import PostCardThumbnail from './PostCardThumbnail'

import styles from '../Styles/PostCardStyles'

export default class PostCardSlider extends Component {
  static propTypes = {
    postcards: PropTypes.array,
    getPostcards: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { postcards, getPostcards } = this.props

    if (postcards.length === 0 && getPostcards) {
      getPostcards()
    }
  }

  keyExtractor = item => item._id

  renderItem = ({item}) => {
    return (
      <PostCardThumbnail postcard={item} />
    )
  }

  render() {
    const { postcards } = this.props

    return (
      <View style={styles.container}>
        <FlatList
          data={[postcards]}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          style={styles.listContainer}
        />
      </View>
    )
  }
}
