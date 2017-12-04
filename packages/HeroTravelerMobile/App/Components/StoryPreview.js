import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import moment from 'moment'

import formatCount from '../Shared/Lib/formatCount'
import getImageUrl from '../Shared/Lib/getImageUrl'
import { Metrics } from '../Shared/Themes'
import styles from './Styles/StoryPreviewStyle'
import profileViewStyles from './Styles/ProfileViewStyles'
import LikesComponent from './LikeComponent'
import TrashCan from '../Components/TrashCan'
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
    autoPlayVideo: PropTypes.bool,
    allowVideoPlay: PropTypes.bool,
    isStoryReadingScreen: PropTypes.bool,
    gradientColors: PropTypes.arrayOf(PropTypes.string),
    isVisible: PropTypes.bool,
    areInRenderLocation: PropTypes.bool,

  }

  static defaultProps = {
    showLike: true,
    isStoryReadingScreen: false,
  }

  _touchEdit = () => {
    if (this.props.touchEdit) {
      this.props.touchEdit(this.props.story.id)
    }
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
        { text: 'Delete', onPress: () => deleteStory(userId, storyId), style: 'destructive' }
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

  renderUserSection() {
    const {user, story, isStoryReadingScreen} = this.props
    const isFollowing = _.includes(this.props.myFollowedUsers, user.id)
    return (
      <View style={[styles.storyInfoContainer, styles.verticalCenter, styles.userContainer]}>
        <View style={styles.userContent}>

          <View style={styles.leftUserContent}>
            <TouchableOpacity onPress={this._touchUser}>
              <Avatar
                size={'extraSmall'}
                style={styles.avatar}
                avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
              />
            </TouchableOpacity>
            <View style={styles.verticalCenter}>
              <TouchableOpacity onPress={this._touchUser}>
                <Text style={styles.username}>{user.username}</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>{moment(story.createdAt).format('LL')}</Text>
            </View>
          </View>
          { isStoryReadingScreen &&
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
                {width: 100, marginHorizontal: 10}
              ]}
            >
              {isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
            </Text>
          </TouchableOpacity>
          }
        </View>
      </View>
    )
  }

  renderBottomSection() {
    const {title, counts, description} = this.props.story

    return (
      <View style={[styles.storyInfoContainer, styles.bottomContainer]}>
        <Text style={[styles.title, this.props.titleStyle]}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
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
    return this.props.isVisible !== false && this.props.areInRenderLocation
  }

  render () {
    const {story} = this.props
    if (!story) return null
    // using StoryPreview height as proxy for StoryCover playbutton size
    const height = this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20
    const playButtonSize = height > 250 ? 'large' : 'small'

    return (
      <View style={styles.contentContainer}>
        {false &&
          <TrashCan touchTrash={this._touchTrash} touchEdit={this._touchEdit} />
        }
        {!this.props.isStoryReadingScreen && this.renderUserSection()}
        <StoryCover
          autoPlayVideo={this.props.autoPlayVideo}
          allowVideoPlay={this.props.allowVideoPlay}
          cover={story.coverImage ? story.coverImage : story.coverVideo}
          coverType={story.coverImage ? 'image' : 'video'}
          onPress={this.props.onPress}
          gradientColors={this.props.gradientColors}
          gradientLocations={this.props.gradientLocations}
          showPlayButton={this.props.showPlayButton}
          playButtonSize={playButtonSize}
          isFeed={this.props.isVisible !== undefined}
          shouldEnableAutoplay={this.shouldEnableAutoplay()}
        />
        {this.props.isStoryReadingScreen && this.renderUserSection()}
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
