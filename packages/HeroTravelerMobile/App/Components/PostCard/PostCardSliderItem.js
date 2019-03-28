import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ImageBackground, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import getImageUrl from '../../Shared/Lib/getImageUrl'

import styles from '../Styles/PostCardStyles'

export default class PostCardSliderItem extends Component {
  static props = {
    postcard: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { postcard: { coverImage, title } } = this.props
    return (
      <ImageBackground
        source={{uri: getImageUrl(coverImage)}}
        style={styles.imageContainer}
      >
        <View style={styles.imageOverlayContainer}>
          <Text>{title}</Text>
        </View>
      </ImageBackground>
    )
  }
}
