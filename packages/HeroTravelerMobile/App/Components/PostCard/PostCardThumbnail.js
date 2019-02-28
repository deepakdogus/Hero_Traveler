import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Actions as NavActions } from 'react-native-router-flux'

import ImageWrapper from '../../Components/ImageWrapper'

import styles from '../Styles/PostCardStyles'

export default class PostCardThumbnail extends Component {
  static propTypes = {
    cardId: PropTypes.string,
    caption: PropTypes.string,
    imageUrl: PropTypes.string,
  }

  _navToPostCard = () => {
    // const { cardId } = this.props
    // NavActions.
  }

  render() {
    const { imageUrl, caption } = this.props

    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={this._navToPostCard}>
          <ImageWrapper
            cached={true}
            resizeMode='cover'
            source={{uri: imageUrl}}
            style={styles.thumbnailImage}
          />
          <LinearGradient
            locations={[0, 0.4, 1]}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0.8)']}
            style={styles.overlayContainer}>
            <Text style={styles.caption}>
              {caption}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}
