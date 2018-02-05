import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
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
import { Metrics } from '../Shared/Themes'
import styles from './Styles/StoryPreviewStyle'
import {styles as StoryReadingScreenStyles} from '../Containers/Styles/StoryReadingScreenStyles'
import profileViewStyles from './Styles/ProfileViewStyles'
import LikesComponent from './LikeComponent'
import TrashCan from './TrashCan'
import Avatar from './Avatar'
import StoryCover from './StoryCover'
import TabIcon from './TabIcon'

export default class StoryPreview extends Component {
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
    isStoryReadingScreen: PropTypes.bool,
    gradientColors: PropTypes.arrayOf(PropTypes.string),
    isVisible: PropTypes.bool,
    areInRenderLocation: PropTypes.bool,
    deleteStory: PropTypes.func,
    onPressFollow: PropTypes.func,
    onPressUnfollow: PropTypes.func,
    isAuthor: PropTypes.bool,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    showLike: true,
    isStoryReadingScreen: false,
  }

  _touchEdit = () => {
    const storyId = this.props.story.id
    NavActions.createStoryFlow({storyId, type: 'reset', navigatedFromProfile: true, shouldLoadStory: false})
    NavActions.createStory_cover({storyId, navigatedFromProfile: true, shouldLoadStory: false})
  }

  _touchTrash = () => {
    const storyId = this.props.story.id
    const userId = this.props.user.id
    const { deleteStory } = this.props
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteStory(userId, storyId)
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

  renderUserSection() {
    const {user, story, isStoryReadingScreen, isAuthor} = this.props
    const isFollowing = _.includes(this.props.myFollowedUsers, user.id)

    return (
      <View style={[
        styles.storyInfoContainer, styles.verticalCenter, styles.userContainer,
        !isStoryReadingScreen && styles.previewUserContainer,
      ]}>
        <View style={styles.userContent}>
          <View style={styles.leftUserContent}>
            <TouchableOpacity onPress={this._touchUser}>
              <Avatar
                size={isStoryReadingScreen ? 'small' : 'extraSmall'}
                style={styles.avatar}
                avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
              />
            </TouchableOpacity>
            <View style={styles.verticalCenter}>
              <TouchableOpacity onPress={this._touchUser} style={styles.profileButton}>
                {this.hasBadge() &&
                  <TabIcon
                    name={this.props.user.role === 'contributor' ? 'contributor' : 'founder'}
                    style={{
                      image: styles.badgeImage,
                      view: styles.badgeView,
                    }}
                 />
                }
                <Text style={[
                  styles.username,
                  isStoryReadingScreen && styles.usernameReading,
                ]}>
                  {user.username}
                </Text>
              </TouchableOpacity>
            <Text style={[
              styles.dateText,
              isStoryReadingScreen && styles.dateTextReading
            ]}>
              {moment(story.tripDate || story.createdAt).format('LL')}
            </Text>
            </View>
          </View>
          {isStoryReadingScreen && !isAuthor &&
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
          {isStoryReadingScreen && isAuthor &&
            <View>
              <TrashCan touchTrash={this._touchTrash} touchEdit={this._touchEdit} />
            </View>
          }
        </View>
      </View>
    )
  }

  renderBottomSection() {
    const {title, counts, description, coverCaption} = this.props.story
    const {isStoryReadingScreen, onPress} = this.props

    return (
      <View style={[styles.storyInfoContainer, styles.bottomContainer]}>
        {isStoryReadingScreen && !!coverCaption &&
          <Text style={[StoryReadingScreenStyles.caption, styles.caption]}>
            {coverCaption}
          </Text>
        }
        <TouchableOpacity onPress={onPress} disabled={!!isStoryReadingScreen}>
          <Text style={[
            styles.title,
            isStoryReadingScreen ? styles.storyReadingTitle : {},
            this.props.titleStyle
          ]}>
            {title}
          </Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </TouchableOpacity>
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
      </View>
    )
  }

  shouldEnableAutoplay(){
    // console.log("\nthis.props.index", this.props.index, this.props.renderLocation)
    // console.log("preview bool combined", this.props.isVisible !== false && this.props.areInRenderLocation)
    // console.log("preview bool 1", this.props.isVisible !== false)
    // console.log("preview bool 2", this.props.areInRenderLocation)
    return this.props.isVisible !== false && this.props.areInRenderLocation
  }

  render () {
    const {story, gradientLocations, showPlayButton, shouldHideCover} = this.props
    if (!story) return null
    // using StoryPreview height as proxy for StoryCover playbutton size
    const height = this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20
    const playButtonSize = height > 250 ? 'large' : 'small'

    return (
      <View style={styles.contentContainer}>
        {this.renderUserSection()}
        {!shouldHideCover &&
          <StoryCover
            areInRenderLocation={this.props.areInRenderLocation}
            autoPlayVideo={this.props.autoPlayVideo}
            allowVideoPlay={this.props.allowVideoPlay}
            cover={story.coverImage ? story.coverImage : story.coverVideo}
            coverType={story.coverImage ? 'image' : 'video'}
            onPress={this.props.onPress}
            gradientColors={this.props.gradientColors}
            gradientLocations={gradientLocations}
            showPlayButton={showPlayButton}
            playButtonSize={playButtonSize}
            isFeed={this.props.isVisible !== undefined}
            shouldEnableAutoplay={this.shouldEnableAutoplay()}
          />
        }
        {this.renderBottomSection()}
      </View>
    )
  }

  _onPressLike = () => {
    const {story, onPressLike} = this.props
    if (onPressLike) {
      onPressLike(story)
    }
  }
}
