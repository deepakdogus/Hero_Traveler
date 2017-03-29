
import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Metrics, Images, Colors } from '../Themes'
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
      <TouchableHighlight onPress={this._onPress}
      style={{height: this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20}}>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <Image
              resizeMode="cover"
              source={{uri: getUrl(coverImage)}}
              style={styles.thumbnailImage}
          ></Image>
          <View style={{flexDirection: "column"}}>
            <Text style={[styles.title, this.props.titleStyle]}>{title}</Text>
            <Text style={[styles.subtitle, this.props.subtitleStyle]}>{description}</Text>
          </View>
        </View>
        <View style={styles.icon}>
          <Icon name='chevron-right' size={15} color={Colors.steel} />
        </View>
        </View>
      </TouchableHighlight>
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
