import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
// import { Actions as NavActions } from 'react-native-router-flux'
import ImageWrapper from '../../Components/ImageWrapper'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import styles from '../Styles/PostCardStyles'

export default class PostCardThumbnail extends Component {
  static propTypes = {
    postcard: PropTypes.object,
  }

  navigateToPostcard = () => {
    // const { cardId } = this.props
    // NavActions.
  }

  render() {
    const { postcard } = this.props

    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={this.navigateToPostcard}
          style={styles.innerContainer}
        >
          <ImageWrapper
            cached={true}
            resizeMode='cover'
            fullWidth
            limitedHeight
            source={{uri: getImageUrl(postcard.coverImage)}}
          />
          <LinearGradient
            locations={[0, 0.3, 1]}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0.4)']}
            style={styles.overlayContainer}>
            <Text style={styles.caption}>
              {postcard.caption}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}
