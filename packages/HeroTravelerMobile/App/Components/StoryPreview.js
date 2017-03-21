import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import { Metrics, Images } from '../Themes'
import styles from './Styles/StoryPreviewStyle'
import LikesComponent from './LikeComponent'

/*
TODO:
- Fix the Navar height issue
*/
export default class StoryPreview extends Component {
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

    console.log('this.props.height', this.props.height)
    return (
      <TouchableHighlight onPress={this._onPress}
        style={{height: this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20}}>
        <View style={styles.contentContainer}>
          <Image
            resizeMode="cover"
            source={{uri: coverImage}}
            style={[styles.backgroundImage, styles.previewImage]}
          >
            <LinearGradient colors={['transparent', 'black']} style={styles.previewInfo}>
              <Text style={styles.title}>{title.toUpperCase()}</Text>
              <Text style={styles.subtitle}>{description}</Text>
              <View style={styles.divider}></View>
              <View style={styles.detailContainer}>
                <View style={styles.row}>
                  <Image style={styles.avatar} source={{uri: profile.avatar}}></Image>
                  <Text style={styles.username}>{username}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.bottomRight, styles.timeSince]}>2 days ago</Text>
                  <LikesComponent
                    onPress={this._onPressLike}
                    numberStyle={styles.bottomRight}
                    likes={42}
                    isLiked={false}
                  />
                </View>
              </View>
            </LinearGradient>
          </Image>
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
