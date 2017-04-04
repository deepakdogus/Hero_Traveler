import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Metrics, Images, Colors } from '../Themes'
import styles from './Styles/InboxStyle'

function getUrl(coverImage) {
  return `https://s3.amazonaws.com/hero-traveler/story/750x1334/${coverImage.original.filename}`
}


let placeholderContent = (
    <Text style={styles.placeHolderContent}> Bacon ipsum dolor amet cow meatloaf flank pastrami, jowl frankfurter sausage. </Text>
)
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
    let date = new Date(Date.parse(createdAt)).toDateString().split(' ').slice(1,3).join(' ')

    return (
      <TouchableHighlight onPress={this._onPress}
                          style={{height: this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20}}>
        <View style={styles.contentContainer}>
        <Image style={styles.avatar} source={{uri: profile.avatar}}></Image>
        <View style={styles.column}>
        <Text style={styles.title}>{username}</Text>
            {placeholderContent}
      </View>
        <View style={styles.date}>
        <Text style={styles.subtitle}>{date}</Text>
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
