import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
// import { Actions as NavActions } from 'react-native-router-flux'
import ImageWrapper from '../../Components/ImageWrapper'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import styles from '../Styles/PostCardStyles'

import Reactotron from 'reactotron-react-native'

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
    Reactotron.log('Image URL' + getImageUrl(postcard.coverImage))
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
            source={{uri: getImageUrl(postcard.coverImage)}}
            style={styles.coverPhoto}
          />
          <LinearGradient
            locations={[0, 0.3, 1]}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0.4)']}
            style={styles.overlayContainer}>
            <Text style={styles.caption}>
              {postcard.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}
