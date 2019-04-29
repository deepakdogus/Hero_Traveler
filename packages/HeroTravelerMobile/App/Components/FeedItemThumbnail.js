import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import styles from './Styles/FeedItemsThumbnailStyles'
import ImageWrapper from './ImageWrapper'
import {TouchlessPlayButton} from './VideoPlayer'
import TabIcon from './TabIcon'

export default class FeedItem extends Component {
  static propTypes = {
    feedItem: PropTypes.object,
    coverUrl: PropTypes.string,
    isVideo: PropTypes.bool,
    isGuide: PropTypes.bool,
    authorId: PropTypes.string,
    username: PropTypes.string,
    onPressAuthor: PropTypes.func,
    handlePress: PropTypes.func,
  }

  navToStory = () => NavActions.story({
    storyId: this.props.feedItem.id,
    title: this.props.feedItem.title,
  })

  navToGuide = () => NavActions.guide({
    guideId: this.props.feedItem.id,
    title: this.props.feedItem.title,
  })

  onPressAuthor = () => this.props.onPressAuthor(this.props.authorId)

  renderPlayButton = () => {
    return (
      <View style={styles.playButtonAbsolute}>
        <View style={styles.playButtonCenter}>
          <TouchlessPlayButton size={20}/>
        </View>
      </View>
    )
  }

  render = () => {
    const {
      feedItem,
      coverUrl,
      isVideo,
      isGuide,
      username,
    } = this.props

    const onPressFeedItem = isGuide
      ? this.navToGuide
      : this.navToStory

    return (
      <View key={feedItem.id} style={styles.feedItemView}>
        <TouchableOpacity onPress={onPressFeedItem}>
          <View>
            <ImageWrapper
              cached
              source={{uri: coverUrl}}
              style={styles.image}
              resizeMode='cover'
            />
            {isGuide && (
              <TabIcon name='guide-alt' style={{
                view: styles.guideIconView,
                image: styles.guideIconImage,
              }}
              />
            )}
          </View>
          {isVideo && this.renderPlayButton()}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {feedItem.title}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressAuthor}>
          <Text style={styles.author}>{username}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
