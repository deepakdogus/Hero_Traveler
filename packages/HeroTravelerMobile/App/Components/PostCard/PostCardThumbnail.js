import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Actions as NavActions } from 'react-native-router-flux'
import ImageWrapper from '../../Components/ImageWrapper'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import styles from '../Styles/PostCardStyles'

export default class PostCardThumbnail extends Component {
  static propTypes = {
    postcard: PropTypes.object,
  }

  navigateToPostcard = () => {
    // const { cardId } = this.props
    NavActions.viewQuickShare()
  }

  render() {
    const { postcard } = this.props
    let coverImageUrl

    if (postcard.coverImage) {
      coverImageUrl = getImageUrl(postcard.coverImage )
    }
    else if (postcard.coverVideo) {
      const videoThumbnailOptions = {
        video: true,
        width: 'screen',
      }
      coverImageUrl = getImageUrl(postcard.coverVideo, 'optimized', videoThumbnailOptions)
    }
    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={this.navigateToPostcard}
          style={styles.innerContainer}
        >
          <ImageWrapper
            background={true}
            cached={true}
            resizeMode='cover'
            source={{uri: coverImageUrl}}
            style={styles.coverPhoto}
          />
          <LinearGradient
            locations={[0, 0.3, 1]}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0.4)']}
            style={styles.overlayContainer}>
            <Text
              style={styles.caption}
              multiline
            >
              {postcard.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}
