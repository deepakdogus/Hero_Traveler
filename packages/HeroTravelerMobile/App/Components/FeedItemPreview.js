import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'

import formatCount from '../Shared/Lib/formatCount'
import getImageUrl from '../Shared/Lib/getImageUrl'
import isLocalDraft from '../Shared/Lib/isLocalDraft'
import { displayLocationPreview } from '../Shared/Lib/locationHelpers'
import { Metrics } from '../Shared/Themes'
import styles from './Styles/FeedItemPreviewStyle'
import { styles as storyReadingScreenStyles } from '../Containers/Styles/StoryReadingScreenStyles'
import profileViewStyles from './Styles/ProfileViewStyles'
import LikesComponent from './LikeComponent'
import TrashCan from './TrashCan'
import Avatar from './Avatar'
import FeedItemCover from './FeedItemCover'
import TabIcon from './TabIcon'
import GuideMap from './GuideMap'
import {
  roleToIconName,
  hasBadge,
} from '../Shared/Lib/badgeHelpers'
import { showPublishDate } from '../Shared/Lib/dateHelpers'
import StarRating from '../Containers/CreateStory/StarRating'

// FeedItems are either a Story or a Guide
export default class FeedItemPreview extends Component {
  // is showLike now always true? MBT - 12/07/17
  static propTypes = {
    user: PropTypes.object,
    sessionUserId: PropTypes.string,
    feedItem: PropTypes.object,
    onPressGuide: PropTypes.func,
    onPressStory: PropTypes.func,
    onPressStoryLike: PropTypes.func,
    onPressStoryUnlike: PropTypes.func,
    onPressGuideLike: PropTypes.func,
    onPressGuideUnlike: PropTypes.func,
    onPress: PropTypes.func,
    onPressUser: PropTypes.func,
    forProfile: PropTypes.bool,
    height: PropTypes.number,
    isStoryLiked: PropTypes.bool,
    isGuideLiked: PropTypes.bool,
    showLike: PropTypes.bool,
    isShowCover: PropTypes.bool,
    autoPlayVideo: PropTypes.bool,
    allowVideoPlay: PropTypes.bool,
    isReadingScreen: PropTypes.bool,
    isVisible: PropTypes.bool,
    isFeed: PropTypes.bool,
    isStory: PropTypes.bool,
    areInRenderLocation: PropTypes.bool,
    deleteGuide: PropTypes.func,
    deleteStory: PropTypes.func,
    onPressFollow: PropTypes.func,
    onPressUnfollow: PropTypes.func,
    isAuthor: PropTypes.bool,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.string),
    showPlayButton: PropTypes.bool,
    titleStyle: PropTypes.number,
    onPressBookmark: PropTypes.func,
    onPressRemoveBookmark: PropTypes.func,
    isBookmarked: PropTypes.bool,
    selectedStories: PropTypes.array,
    location: PropTypes.string,
  }

  static defaultProps = {
    showLike: true,
    isReadingScreen: false,
    isFeed: true,
  }

  navToStoryEdit = () => {
    const storyId = this.props.feedItem.id

    NavActions.createStoryFlow({
      storyId,
      type: 'reset',
      navigatedFromProfile: true,
      shouldLoadStory: false,
    })
    NavActions.createStory_cover({
      storyId,
      navigatedFromProfile: true,
      shouldLoadStory: false,
    })
  }

  _touchEdit = () => {
    const {isStory, feedItem} = this.props
    if (isStory) this.navToStoryEdit()
    else NavActions.createGuide({ guideId: feedItem.id })
  }

  _touchTrash = () => {
    const { deleteStory, feedItem, user, isStory, deleteGuide} = this.props
    Alert.alert(
      `Delete ${isStory ? 'Story' : 'Guide'}`,
      `Are you sure you want to delete this ${isStory ? 'story' : 'guide'}?`,
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isStory) {
              deleteStory(user.id, feedItem.id)
            }
            else {
              deleteGuide(feedItem.id)
            }
            NavActions.pop()
          },
        },
      ],
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

  _onPressBookmark = () => {
    if (this.props.isBookmarked) return this.props.onPressRemoveBookmark()
    return this.props.onPressBookmark()
  }

  renderDate(){
    const {isReadingScreen, feedItem} = this.props
    return (
      <Text style={[
        styles.dateText,
        isReadingScreen && styles.dateTextReading,
      ]}>
        {showPublishDate(feedItem)}
      </Text>
    )
  }

  hasLocation = () => {
    const {locationInfo, locations = []} = this.props.feedItem
    return !!locationInfo || locations.length !== 0
  }

  shouldRenderDescription = () => {
    const {
      isStory,
      isFeed,
      isReadingScreen,
      feedItem: { description },
    } = this.props
    return !!description
      && !(!isStory && isFeed)
      && isReadingScreen
  }

  shouldRenderBookmarks = () => (
    this.props.showLike
    && this.props.onPressBookmark
    && this.props.isStory
  )

  getLocationText = () => {
    const {locationInfo, locations = []} = this.props.feedItem
    if (locationInfo) return displayLocationPreview(locationInfo)
    else if (locations.length) return displayLocationPreview(locations[0])
  }

  renderUserSection() {
    const {user, isReadingScreen, isAuthor} = this.props
    const isFollowing = _.includes(this.props.myFollowedUsers, user.id)

    const userAvatar = user && user.profile ? user.profile.avatar : undefined

    return (
      <View style={[
        styles.verticalCenter, styles.userContainer,
        isReadingScreen && styles.storyInfoContainer,
        !isReadingScreen && styles.previewUserContainer,
      ]}>
        <View style={styles.userContent}>
          <View style={styles.leftUserContent}>
            <TouchableOpacity onPress={this._touchUser}>
              <Avatar
                size={isReadingScreen ? 'small' : 'extraSmall'}
                style={styles.avatar}
                avatarUrl={getImageUrl(userAvatar, 'avatar')}
              />
            </TouchableOpacity>
            <View style={styles.verticalCenter}>
              <TouchableOpacity
                onPress={this._touchUser}
                style={styles.profileButton}
              >
                {hasBadge(user.role) && (
                  <TabIcon
                    name={roleToIconName[user.role]}
                    style={{
                      image: styles.badgeImage,
                      view: styles.badgeView,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.verticalCenter}>
              <TouchableOpacity
                onPress={this._touchUser}
                style={styles.profileButton}
              >
                <Text style={[
                  styles.username,
                  isReadingScreen && styles.usernameReading,
                ]}>
                  {user.username}
                </Text>
              </TouchableOpacity>
              {this.renderDate()}
            </View>
          </View>
          {isReadingScreen && !isAuthor && (
            <View style={styles.verticalCenter}>
              <TouchableOpacity
                style={[
                  profileViewStyles.blackButton,
                  isFollowing ? null : profileViewStyles.followButton,
                  styles.followFollowingButton,
                ]}
                onPress={isFollowing ? this._onPressUnfollow : this._onPressFollow}>
                <Text style={[
                  profileViewStyles.blackButtonText,
                  isFollowing ? null : profileViewStyles.followButtonText,
                  styles.followFollowingText,
                ]}
                >
                  {isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isReadingScreen && isAuthor && (
            <View style={styles.editStyles}>
              <TrashCan
                touchTrash={this._touchTrash}
                touchEdit={this._touchEdit}
                centered
              />
            </View>
          )}
        </View>
        {this.isGuideReadingScreen() && this.renderTitle()}
      </View>
    )
  }

  _onPress = () => {
    return this.getOnPress()(this.getLocationText())
  }

  renderTitle() {
    const {title, description} = this.props.feedItem
    const {isReadingScreen, titleStyle, isStory, isFeed} = this.props
    let showDescription = (isStory || !isFeed)
    return (
      <Text style={[
        styles.title,
        (description && showDescription) ? styles.titleWithDescription : {},
        isReadingScreen ? styles.storyReadingTitle : {},
        (isReadingScreen && description && showDescription) ? styles.storyReadingTitleWithDescription : {},
        titleStyle,
      ]}>
        {title}
      </Text>
    )
  }

  isGuideReadingScreen() {
    const {isStory, isReadingScreen} = this.props
    return !isStory && isReadingScreen
  }

  getIsLiked = () => {
    const {isStory, isStoryLiked, isGuideLiked} = this.props
    return isStory ? isStoryLiked : isGuideLiked
  }

  renderBottomSection() {
    const {counts, description, coverCaption, draft, type, rating} = this.props.feedItem
    const {isReadingScreen, isStory, isStoryLiked, isGuideLiked} = this.props

    if (this.isGuideReadingScreen()) return null

    return (
      <View style={[
        styles.storyInfoContainer,
        styles.bottomContainer,
        !isReadingScreen && styles.roundedBottomContainer,
      ]}>
        {isReadingScreen && !!coverCaption && (
          <Text style={[storyReadingScreenStyles.caption, styles.caption]}>
            {coverCaption}
          </Text>
        )}
        {isReadingScreen && isStory && (
          <View style={styles.activityRow}>
            <View style={styles.activityIconContainer}>
              <TabIcon
                name={`activity-${type}`}
                style={{
                  image: styles.activityIcon,
                }}
              />
            </View>
          </View>
        )}
        {!isReadingScreen && this.hasLocation() && (
          <Text
            style={styles.locationText}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {this.getLocationText()}
          </Text>
        )}
        <TouchableOpacity
          onPress={this._onPress}
          disabled={!!isReadingScreen}
        >
          {this.renderTitle()}
          {this.shouldRenderDescription() && (
            <Text style={storyReadingScreenStyles.description}>
              {description}
            </Text>
          )}
        </TouchableOpacity>
        {isReadingScreen && rating && false && (
          <View style={storyReadingScreenStyles.starRating}>
            <Text style={storyReadingScreenStyles.experience}>
              Overall Experience:
            </Text>
            <StarRating valueSelected={rating} />
          </View>
        )}
        <View style={styles.lastRow}>
          {!isReadingScreen && (
            <View style={styles.leftRow}>
              {this.renderUserSection()}
            </View>
          )}

          {!draft && (
            <View style={styles.rightRow}>
              {this.shouldRenderBookmarks()
                && (
                  <View style={styles.bookmarkContainer}>
                    <TouchableOpacity
                      onPress={this._onPressBookmark}
                    >
                      <TabIcon
                        name={this.props.isBookmarked ? 'bookmark-active' : 'bookmark'}
                        style={{
                          image: styles.bookmark,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              {this.props.showLike && (
                <LikesComponent
                  onPress={this._onPressLike}
                  likes={formatCount(counts.likes)}
                  isLiked={isStory ? isStoryLiked : isGuideLiked}
                  isRightText
                />
              )}
            </View>
          )}
        </View>
      </View>
    )
  }

  shouldEnableAutoplay(){
    return this.props.isVisible !== false && this.props.areInRenderLocation
  }

  getOnPress = () => {
    const {isStory, onPressStory, onPressGuide, feedItem} = this.props
    if (!isStory) return onPressGuide
    return isLocalDraft(feedItem.id)
      ? this.navToStoryEdit
      : onPressStory
  }

  render () {
    const {
      feedItem,
      showPlayButton,
      isShowCover,
      selectedStories,
      location,
      isStory,
    } = this.props
    if (!feedItem) return null

    // using FeedItemPreview height as proxy for FeedItemCover playbutton size
    const height = this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20
    const playButtonSize = height > 250 ? 'large' : 'small'
    const cover = feedItem.coverImage || feedItem.coverVideo
    const isReadingScreen = location === 'story' || location === 'guide'

    return (
      <View style={[
        styles.contentContainer,
        !isReadingScreen && styles.cardView,
      ]}>
        {isReadingScreen && this.renderUserSection()}
        {isShowCover && (
          <FeedItemCover
            areInRenderLocation={this.props.areInRenderLocation}
            autoPlayVideo={this.props.autoPlayVideo}
            allowVideoPlay={this.props.allowVideoPlay}
            cover={cover}
            coverType={feedItem.coverImage ? 'image' : 'video'}
            onPress={this._onPress}
            showPlayButton={showPlayButton}
            playButtonSize={playButtonSize}
            isFeed={this.props.isFeed}
            shouldEnableAutoplay={this.shouldEnableAutoplay()}
            title={this.props.feedItem.title}
            isReadingScreen={isReadingScreen}
            isGuide={!isStory}
            style={styles.feedItemCover}
          />
        )}
        {!isShowCover && (
          <GuideMap
            stories={selectedStories}
          />
        )}
        {this.renderBottomSection()}
      </View>
    )
  }

  _onPressLike = () => {
    const {
      feedItem, isStory, sessionUserId,
      isGuideLiked, onPressGuideLike, onPressGuideUnlike,
      isStoryLiked, onPressStoryLike, onPressStoryUnlike,
    } = this.props

    if (isStory) {
      if (isStoryLiked) onPressStoryUnlike(feedItem.id, sessionUserId)
      else onPressStoryLike(feedItem.id, sessionUserId)
    }
    else {
      if (isGuideLiked) onPressGuideUnlike(feedItem.id, sessionUserId)
      else onPressGuideLike(feedItem.id, sessionUserId)
    }
  }
}
