import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Metrics, Images, Colors } from '../Themes'
import styles from './Styles/ActivityStyle'
import LikesComponent from './LikeComponent'

function getUrl(coverImage) {
  return `https://s3.amazonaws.com/hero-traveler/story/750x1334/${coverImage.original.filename}`
}

/*
TODO:
- Fix the Navar height issue
*/
export default class Activity extends Component {
  static propTypes = {
    onPressLike: PropTypes.func,
    onPress: PropTypes.func,
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
              <Image style={styles.avatar} source={{uri: profile.avatar}}></Image>
              <Text style={styles.title}>{username}</Text>
              <Text style={styles.subtitle}>{description}</Text>
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
