import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import CreatePostCardBackground from './CreatePostCardBackground'
import { Images, Colors } from '../../Shared/Themes'

import styles from '../Styles/PostCardStyles'

const handleClosePostCard = () => NavActions.pop()

const PostCardSliderItem = ({ postcard, postcard: { title } }) => (
  <CreatePostCardBackground
    media={postcard}
    mediaType={postcard.coverVideo ? 'video' : 'photo'}
  >
    <View style={styles.sliderOverlayContainer}>
      <View style={styles.sliderHeader}>
        <Icon name='md-close-circle'
          size={34}
          color={Colors.snow}
          onPress={handleClosePostCard}
        />
      </View>
      <Text>{title}</Text>
    </View>
  </CreatePostCardBackground>
)

PostCardSliderItem.propTypes = {
  postcard: PropTypes.object.isRequired,
}

export default PostCardSliderItem
