import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import CreatePostCardBackground from './CreatePostCardBackground'
import { displayLocationPreview } from '../../Shared/Lib/locationHelpers'

import { Colors } from '../../Shared/Themes'

import styles from '../Styles/PostCardStyles'

class PostCardSliderItem extends Component {
  getLocationText = () => {
    const {locationInfo, locations = []} = this.props.postcard
    if (locationInfo) return displayLocationPreview(locationInfo)
    else if (locations.length) return displayLocationPreview(locations[0])
  }

  handleClose = () => NavActions.pop()

  render() {
    const { postcard, postcard: { title } } = this.props
    return (
      <CreatePostCardBackground
        media={postcard}
        mediaType={postcard.coverVideo ? 'video' : 'photo'}
      >
        <View style={styles.sliderOverlayContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLocation}>{this.getLocationText()}</Text>
            <Icon name='md-close'
              size={30}
              color={Colors.snow}
              onPress={this.handleClose}
              style={styles.closeBtn}
            />
          </View>
          <View style={styles.sliderContentInner}>
            <Text style={styles.sliderTitle}>{title}</Text>
          </View>
        </View>
      </CreatePostCardBackground>
    )
  }
}

PostCardSliderItem.propTypes = {
  postcard: PropTypes.object.isRequired,
}

export default PostCardSliderItem
