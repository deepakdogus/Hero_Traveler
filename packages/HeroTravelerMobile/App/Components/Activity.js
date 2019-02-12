import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import moment from 'moment'

import { Colors, Metrics } from '../Shared/Themes/'
import Avatar from '../Components/Avatar'
import ImageWrapper from '../Components/ImageWrapper'
import { PlayButton } from '../Components/VideoPlayer'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {
  getDescriptionText,
  getContent,
  getAvatar,
  getUsername,
  getUserId,
  getFeedItemTitle,
  getFeedItemImageUrl,
  getHasVideo,
  ActivityTypes,
} from '../Shared/Lib/NotificationHelpers'
import { displayLocationPreview } from '../Shared/Lib/locationHelpers'

const videoThumbnailOptions = {
  video: true,
  width: 100,
  height: 100,
}

export default class Activity extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    activity: PropTypes.object,
    markSeen: PropTypes.func,
  }

  state = { imageUrl: '' }

  componentDidMount = () => {
    // only fetch image one time for performance
    const imageUrl = getFeedItemImageUrl(
      this.props.activity,
      videoThumbnailOptions,
    )
    if (imageUrl) this.setState({imageUrl})
  }

  _markSeen = () => {
    const {
      activity: { seen, id },
      markSeen,
    } = this.props
    if (!seen) markSeen(id)
  }

  _navToUser = () => {
    const { activity } = this.props
    NavActions.readOnlyProfile({ userId: getUserId(activity) })
  }

  _navToReadingScreen = () => {
    const { activity } = this.props
    const isStory = activity.kind === ActivityTypes.like
      || activity.kind === ActivityTypes.comment
    const type = isStory ? 'story' : 'guide'
    NavActions[type]({
      [`${type}Id`]: activity[type]._id,
      title: displayLocationPreview(activity[type].locationInfo),
    })
  }

  render() {
    const { activity } = this.props
    const { imageUrl } = this.state

    const content = getContent(activity)
    const avatar = getAvatar(activity)
    const username = getUsername(activity)

    const hasVideo = getHasVideo(activity)

    return (
      <View style={styles.root}>
        <TouchableOpacity onPress={this._markSeen}>
          <View style={styles.container}>
            <TouchableOpacity onPress={this._navToUser}>
              <Avatar avatarUrl={avatar ? getImageUrl(avatar, 'avatar') : null} />
            </TouchableOpacity>
            <View style={styles.middle}>
              <Text style={styles.description}>
                <Text
                  style={styles.actionText}
                  onPress={this._navToUser}
                >
                  {`${username} ` || 'A user '}
                </Text>
                <Text>{getDescriptionText(activity)}</Text>
                <Text
                  style={styles.actionText}
                  onPress={this._navToReadingScreen}
                >
                  {getFeedItemTitle(activity)}
                </Text>
              </Text>
              {!!content && (
                <View style={styles.content}>
                  <Text
                    numberOfLines={2}
                    style={styles.contentText}
                  >
                    {content}
                  </Text>
                </View>
              )}
              <Text style={styles.dateText}>
                {moment(activity.createdAt).fromNow()}
              </Text>
            </View>
            <View style={styles.right}>
              {!!imageUrl && (
                <TouchableOpacity
                  style={styles.coverWrapper}
                  onPress={this._navToReadingScreen}
                >
                  {!hasVideo && (
                    <ImageWrapper
                      cached={true}
                      resizeMode='cover'
                      source={{uri: imageUrl}}
                      style={styles.thumbnailImage}
                    />
                  )}
                  {hasVideo && (
                    <Fragment>
                      <ImageWrapper
                        cached={true}
                        resizeMode='cover'
                        source={{uri: imageUrl}}
                        style={styles.thumbnailImage}
                      />
                      <PlayButton
                        size='tiny'
                        style={styles.playButton}
                        onPress={this._navToReadingScreen}
                      />
                    </Fragment>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderBottomColor: Colors.navBarText,
    borderBottomWidth: 1,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: Metrics.screenWidth,
  },
  middle: {
    marginHorizontal: Metrics.baseMargin,
    flex: 1,
  },
  dateText: {
    marginTop: Metrics.baseMargin / 2,
    color: Colors.grey,
  },
  content: {
    marginTop: Metrics.baseMargin / 2,
  },
  contentText: {
    color: Colors.grey,
    fontSize: 15,
  },
  description: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: '300',
    letterSpacing: 0.7,
  },
  descriptionClickContainer: {
    height: '100%',
    width: '100%',
  },
  actionText: {
    fontWeight: '600',
    color: Colors.background,
  },
  coverWrapper: {
    position: 'relative',
  },
  thumbnailImage: {
    height: 40,
    width: 40,
  },
  playButton: {
    position: 'absolute',
    marginHorizontal: 10,
    marginTop: 10,
  },
})
