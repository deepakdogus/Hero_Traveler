import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView } from 'react-native'

import PostCardThumbnail from './PostCardThumbnail'

import styles from '../Styles/PostCardStyles'

export default class PostCardList extends Component {
  static propTypes = {
    postCards: PropTypes.array,
  }

  render() {
    const { postCards } = this.props

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          { postCards && postCards.map((postCard, index) => (
            <PostCardThumbnail
              key={index}
              postCard={postCard}
            />
          )) }
        </ScrollView>
      </View>
    )
  }
}
