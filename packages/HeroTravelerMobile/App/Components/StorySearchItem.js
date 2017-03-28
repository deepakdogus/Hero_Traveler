
import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Metrics, Images } from '../Themes'
import styles from './Styles/StorySearchItemStyle'
import LikesComponent from './LikeComponent'

function getUrl(coverImage) {
  return `https://s3.amazonaws.com/hero-traveler/story/750x1334/${coverImage.original.filename}`
}

/*
TODO:
- Fix the Navar height issue
*/
export default class StorySearchItem extends Component {
  static propTypes = {
    onPressLike: PropTypes.func,
    onPress: PropTypes.func,
    forProfile: PropTypes.bool,
  }

  render () {
    let { story } = this.props,
      { coverImage,
        title,
        description,
        author: {
          username,
          profile
        },
        likes,
        createdAt
      } = story;

    return (
        <View style={styles.contentContainer}>
          <Image
            resizeMode="cover"
            source={{uri: getUrl(coverImage)}}
            style={styles.thumbnailImage}
          >
          </Image>
        </View>
    )
  }

  _onPress = () => {
    const {story, onPress} = this.props
    if (onPress) {
      onPress(story)
    }
  }

  _onPressLike = () => {
    const {story, onPressLike} = this.props
    if (onPressLike) {
      onPressLike(story)
    }
  }
}
