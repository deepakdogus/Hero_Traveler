import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'

import formatCount from '../Lib/formatCount'
import { Metrics } from '../Themes'
import styles from './Styles/StoryPreviewStyle'
import LikesComponent from './LikeComponent'
import Avatar from './Avatar'

function getUrl(coverImage) {
  const baseUrl = 'https://s3.amazonaws.com/hero-traveler/'
  const mobile = _.get(coverImage, 'versions.mobile.path', null)
  if (mobile) {
    return baseUrl + mobile
  }

  return baseUrl + coverImage.original.path
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

  wrap(content) {
    if (this.props.onPress) {
      return (
        <TouchableHighlight
          onPress={this._onPress}
          children={content}
          style={{height: this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20}}
        />
      )
    }

    return (
      <View
        children={content}
        style={{height: this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20}}
      />
    )
  }

  render () {
    let { story } = this.props,
      { coverImage,
        title,
        description,
        author: {
          id: authorId,
          username,
          profile
        },
        counts
      } = story

    console.log('profile where it counts', profile)

    const userContent = (
      <View style={styles.row}>
        <Avatar
          style={styles.avatar}
          avatarUrl={profile ? profile.avatar : null}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
    )

    return this.wrap(
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
                {!this.props.forProfile && this.props.onPressUser &&
                  <TouchableOpacity onPress={() => this.props.onPressUser(authorId)}>
                    {userContent}
                  </TouchableOpacity>
                }
                {!this.props.forProfile && !this.props.onPressUser && userContent}
                {this.props.forProfile &&
                  <View style={styles.row}>
                    <Text style={[styles.subtitle, this.props.subtitleStyle]}>{description}</Text>
                    <LikesComponent
                      onPress={this._onPressLike}
                      numberStyle={styles.bottomRight}
                      likes={formatCount(counts.likes)}
                      isLiked={story.isLiked}
                    />
                  </View>
                }
                {!this.props.forProfile &&
                  <View style={styles.row}>
                    <Text style={[styles.bottomRight, styles.timeSince]}>{moment(story.createdAt).fromNow()}</Text>
                    <LikesComponent
                      onPress={this._onPressLike}
                      numberStyle={styles.bottomRight}
                      likes={formatCount(counts.likes)}
                      isLiked={story.isLiked}
                    />
                  </View>
                }
              </View>
            </LinearGradient>
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
