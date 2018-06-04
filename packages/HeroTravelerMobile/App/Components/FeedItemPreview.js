import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import moment from 'moment'
import {Actions as NavActions} from 'react-native-router-flux'

import formatCount from '../Shared/Lib/formatCount'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {displayLocation} from '../Shared/Lib/locationHelpers'
import { Metrics } from '../Shared/Themes'
import styles from './Styles/FeedItemPreviewStyle'
import {styles as storyReadingScreenStyles} from '../Containers/Styles/StoryReadingScreenStyles'
import profileViewStyles from './Styles/ProfileViewStyles'
import LikesComponent from './LikeComponent'
import TrashCan from './TrashCan'
import Avatar from './Avatar'
import FeedItemCover from './FeedItemCover'
import TabIcon from './TabIcon'

// FeedItems are either a Story or a Guide
export default class FeedItemPreview extends Component {
  // is showLike now always true? MBT - 12/07/17
  static propTypes = {
    onPressLike: PropTypes.func,
    onPress: PropTypes.func,
    onPressUser: PropTypes.func,
    forProfile: PropTypes.bool,
    height: PropTypes.number,
    isLiked: PropTypes.bool,
    showLike: PropTypes.bool,
    shouldHideCover: PropTypes.bool,
    autoPlayVideo: PropTypes.bool,
    allowVideoPlay: PropTypes.bool,
    isReadingScreen: PropTypes.bool,
    isVisible: PropTypes.bool,
    isFeed: PropTypes.bool,
    areInRenderLocation: PropTypes.bool,
    deleteStory: PropTypes.func,
    removeDraft: PropTypes.func,
    onPressFollow: PropTypes.func,
    onPressUnfollow: PropTypes.func,
    isAuthor: PropTypes.bool,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.string),
    showPlayButton: PropTypes.bool,
  }

  static defaultProps = {
    showLike: true,
    isReadingScreen: false,
    isFeed: true,
  }

  _touchEdit = () => {
    const feedItemId = this.props.feedItem.id
    NavActions.createStoryFlow({feedItemId, type: 'reset', navigatedFromProfile: true, shouldLoadStory: false})
    NavActions.createStory_cover({feedItemId, navigatedFromProfile: true, shouldLoadStory: false})
  }

  _touchTrash = () => {
    const { deleteStory, removeDraft, feedItem, user } = this.props
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (feedItem.draft) removeDraft(feedItem.id)
            else deleteStory(user.id, feedItem.id)
            NavActions.pop()
          },
        }
      ]
   )
  }

  _touchUser = () => {
    if (this.props.onPressUser) {
      this.props.onPressUser(this.props.user.id)
    }
  }

  _onPressFollow = () => {
    this.props.onPressFollow(this.props.user.id)
  }

  _onPressUnfollow = () => {
    this.props.onPressUnfollow(this.props.user.id)
  }

  hasBadge(){
    const {user} = this.props
    return user.role === 'contributor' || user.role === 'founding member'
  }

  renderDate(){
    const {isReadingScreen, feedItem} = this.props
    return (
      <Text style={[
        styles.dateText,
        isReadingScreen && styles.dateTextReading
      ]}>
        {moment(feedItem.tripDate || feedItem.createdAt).format('LL')}
      </Text>
    )
  }

  renderUserSection() {
    const {user, feedItem, isReadingScreen, isAuthor} = this.props
    const isFollowing = _.includes(this.props.myFollowedUsers, user.id)

    return (
      <View style={[
        styles.storyInfoContainer, styles.verticalCenter, styles.userContainer,
        !isReadingScreen && styles.previewUserContainer,
      ]}>
        <View style={styles.userContent}>
          <View style={styles.leftUserContent}>
            <TouchableOpacity onPress={this._touchUser}>
              <Avatar
                size={isReadingScreen ? 'small' : 'extraSmall'}
                style={styles.avatar}
                avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
              />
            </TouchableOpacity>
            <View style={styles.verticalCenter}>
              <TouchableOpacity onPress={this._touchUser} style={styles.profileButton}>
                {this.hasBadge() &&
                  <TabIcon
                    name={user.role === 'contributor' ? 'contributor' : 'founder'}
                    style={{
                      image: styles.badgeImage,
                      view: styles.badgeView,
                    }}
                 />
                }
                <Text style={[
                  styles.username,
                  isReadingScreen && styles.usernameReading,
                ]}>
                  {user.username}
                </Text>
              </TouchableOpacity>
              {isReadingScreen && this.renderDate()}
              {!isReadingScreen && !!feedItem.locationInfo &&
                <Text style={styles.locationText}>
                  {displayLocation(feedItem.locationInfo)}
                </Text>
              }
            </View>
          </View>
          {isReadingScreen && !isAuthor &&
            <View style={styles.verticalCenter}>
              <TouchableOpacity
                style={[
                  profileViewStyles.blackButton,
                  isFollowing ? null : profileViewStyles.followButton,
                  styles.followFollowingButton
                ]}
                onPress={isFollowing ? this._onPressUnfollow : this._onPressFollow}>
                <Text style={[
                    profileViewStyles.blackButtonText,
                    isFollowing ? null : profileViewStyles.followButtonText,
                    styles.followFollowingText
                  ]}
                >
                  {isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                </Text>
              </TouchableOpacity>
            </View>
          }
          {isReadingScreen && isAuthor &&
            <View>
              <TrashCan touchTrash={this._touchTrash} touchEdit={this._touchEdit} />
            </View>
          }
        </View>
        {this.isGuideReadingScreen() && this.renderTitle()}
        <View style={styles.separator}/>
      </View>
    )
  }

  _onPress = (title) => {
    return () => this.getOnPress()(title)
  }

  renderTitle() {
    const {title, description} = this.props.feedItem
    const {isReadingScreen, titleStyle} = this.props
    return (
      <Text style={[
        styles.title,
        description ? styles.titleWithDescription : {},
        isReadingScreen ? styles.storyReadingTitle : {},
        isReadingScreen && description ? styles.storyReadingTitleWithDescription : {},
        titleStyle
      ]}>
        {title}
      </Text>
    )
  }

  isGuideReadingScreen() {
    const {isStory, isReadingScreen} = this.props
    return !isStory && isReadingScreen
  }

  renderBottomSection() {
    const {title, counts, description, coverCaption, draft} = this.props.feedItem
    const {isReadingScreen} = this.props

    if (this.isGuideReadingScreen()) return null

    return (
      <View style={[styles.storyInfoContainer, styles.bottomContainer]}>
        {isReadingScreen && !!coverCaption &&
          <Text style={[storyReadingScreenStyles.caption, styles.caption]}>
            {coverCaption}
          </Text>
        }
        <TouchableOpacity
          onPress={this._onPress(title)}
          disabled={!!isReadingScreen}
        >
          {this.renderTitle()}
          {!!description &&
            <Text style={storyReadingScreenStyles.description}>
              {description}
            </Text>
          }
        </TouchableOpacity>
        <View style={styles.lastRow}>
          {!isReadingScreen &&
            <View style={styles.leftRow}>
              {this.renderDate()}
            </View>
          }

          {!draft &&
          <View style={styles.rightRow}>
            {this.props.showLike && this.props.onPressBookmark &&
              <View style={styles.bookmarkContainer}>
                <TouchableOpacity
                  onPress={this.props.onPressBookmark}
                >
                  <TabIcon
                    name={this.props.isBookmarked ? 'bookmark-active' : 'bookmark'}
                    style={{
                      image: styles.bookmark
                    }}
                  />
                </TouchableOpacity>
              </View>
            }
            {this.props.showLike &&
              <LikesComponent
                onPress={this._onPressLike}
                likes={formatCount(counts.likes)}
                isLiked={this.props.isLiked}
                isRightText
              />
            }
          </View>
          }
        </View>
      </View>
    )
  }

  shouldEnableAutoplay(){
    return this.props.isVisible !== false && this.props.areInRenderLocation
  }

  getOnPress = () => {
    const {isStory, onPressStory, onPressGuide} = this.props
    return isStory ? onPressStory : onPressGuide
  }

  render () {
    const {feedItem, showPlayButton, shouldHideCover} = this.props
    if (!feedItem) return null

    // using FeedItemPreview height as proxy for FeedItemCover playbutton size
    const height = this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20
    const playButtonSize = height > 250 ? 'large' : 'small'
    let cover = feedItem.coverImage || feedItem.coverVideo
    return (
      <View style={styles.contentContainer}>
        {this.renderUserSection()}
        {!shouldHideCover &&
          <FeedItemCover
            areInRenderLocation={this.props.areInRenderLocation}
            autoPlayVideo={this.props.autoPlayVideo}
            allowVideoPlay={this.props.allowVideoPlay}
            cover={cover}
            coverType={feedItem.coverImage ? 'image' : 'video'}
            onPress={this.getOnPress()}
            showPlayButton={showPlayButton}
            playButtonSize={playButtonSize}
            isFeed={this.props.isFeed}
            shouldEnableAutoplay={this.shouldEnableAutoplay()}
            locationText={displayLocation(feedItem.locationInfo)}
          />
        }
        {this.renderBottomSection()}
      </View>
    )
  }

  _onPressLike = () => {
    const {feedItem, onPressLike} = this.props
    if (onPressLike) {
      onPressLike(feedItem)
    }
  }
}