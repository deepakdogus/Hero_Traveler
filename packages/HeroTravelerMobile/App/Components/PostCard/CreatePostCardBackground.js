import React from 'react'
import PropTypes from 'prop-types'
import { View, ImageBackground } from 'react-native'
import VideoPlayer from '../VideoPlayer'
import getVideoUrl from '../../Shared/Lib/getVideoUrl'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import styles from '../Styles/PostCardStyles'

const CreatePostCardBackground = ({ media, mediaType, children }) => {
  if (mediaType === 'photo') {
    return (
      <ImageBackground
        source={{uri: media.coverImage.uri}}
        style={styles.imageContainer}
      >
        {children}
      </ImageBackground>
    )
  }
  if (mediaType === 'video') {
    const videoThumbnailOptions = {
      video: true,
      width: 'screen',
    }

    const videoImageUrl = getImageUrl(media.coverVideo, 'optimized', videoThumbnailOptions)
    return (
      <View style={styles.videoContainer}>
        <VideoPlayer
          path={getVideoUrl(media.coverVideo)}
          originalPath={getVideoUrl(media.coverVideo, false)}
          imgUrl={videoImageUrl}
          allowVideoPlay={true}
          shouldEnableAutoplay={true}
          autoPlayVideo={true}
          showPlayButton={true}
          showMuteButton={false}
          resizeMode='cover'
          showControls={false}
          style={styles.videoInnerContainer}
        />
        <View style={styles.videoInnerContainer}>
          {children}
        </View>
      </View>
    )
  }
}

CreatePostCardBackground.propTypes = {
  media: PropTypes.object,
  mediaType: PropTypes.string,
  children: PropTypes.object,
}

export default CreatePostCardBackground
