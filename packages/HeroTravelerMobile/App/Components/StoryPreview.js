import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Metrics, Images } from '../Themes'
import styles from './Styles/StoryPreviewStyle'
import LikesComponent from './LikeComponent'

function getUrl(coverImage) {
  return `https://s3.amazonaws.com/hero-traveler/story/750x1334/${coverImage.original.filename}`
}

/*
TODO:
- Fix the Navar height issue
*/
export default class StoryPreview extends Component {
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
console.log('story within story preview', title)
    return (
      <TouchableHighlight onPress={this._onPress}
        style={{height: this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20}}>
        <View style={styles.contentContainer}>
          <Image
            resizeMode="cover"
            source={{uri: getUrl(coverImage)}}
            style={[styles.backgroundImage, styles.previewImage]}
          >
            <LinearGradient colors={['transparent', 'black']} style={styles.gradient}>
              <Text style={[styles.title, this.props.titleStyle]}>{title.toUpperCase()}</Text>
              {!this.props.forProfile && <Text style={[styles.subtitle, this.props.subTitleStyle]}>{description}</Text>}
              {!this.props.forProfile && <View style={styles.divider}></View>}
              <View style={styles.detailContainer}>
                {!this.props.forProfile &&
                  <View style={styles.row}>
                    <Image style={styles.avatar} source={{uri: profile.avatar}}></Image>
                    <Text style={styles.username}>{username}</Text>
                  </View>
                }
                {this.props.forProfile &&
                  <View style={styles.row}>
                    <Text style={[styles.subtitle, this.props.subtitleStyle]}>{description}</Text>
                    <LikesComponent
                      onPress={this._onPressLike}
                      numberStyle={styles.bottomRight}
                      likes={story.counts.likes}
                      isLiked={story.counts.likes % 2 === 0}
                    />
                  </View>
                }
                {!this.props.forProfile &&
                  <View style={styles.row}>
                    <Text style={[styles.bottomRight, styles.timeSince]}>2 days ago</Text>
                    <LikesComponent
                      onPress={this._onPressLike}
                      numberStyle={styles.bottomRight}
                      likes={42}
                      isLiked={false}
                    />
                  </View>
                }
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
