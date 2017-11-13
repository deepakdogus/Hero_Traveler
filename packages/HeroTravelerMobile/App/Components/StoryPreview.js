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
    // using showReadMessage as proxy for story reading page
    showReadMessage: PropTypes.bool,
    gradientColors: PropTypes.arrayOf(PropTypes.string),
    isContentVisible: PropTypes.bool,
  }

  static defaultProps = {
    isContentVisible: true,
    showLike: true,
    showReadMessage: false,
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

  renderTopSection() {
    const {user, story} = this.props

    return (
      <View style={[styles.storyInfoContainer, styles.verticalCenter, styles.topContainer]}>
        <View style={styles.topContent}>
          <TouchableOpacity onPress={this._touchUser}>
            <Avatar
              size={'extraSmall'}
              style={styles.avatar}
              avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
            />
          </TouchableOpacity>
          <View style={styles.verticalCenter}>
            <TouchableOpacity onPress={this._touchUser}>
              <Text style={styles.topUsername}>{user.username}</Text>
            </TouchableOpacity>
            <Text style={styles.topDateText}>{moment(story.createdAt).format('LL')}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderBottomSection() {
    const {title, counts} = this.props.story

    return (
      <View style={[styles.storyInfoContainer, styles.bottomContainer]}>
        <Text style={[styles.title, styles.bottomTitle, this.props.titleStyle]}>{title}</Text>
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

  render () {
    const {story} = this.props
    if (!story) return null
    // using StoryPreview height as proxy for StoryCover playbutton size
    const height = this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20
    const playButtonSize = height > 250 ? 'large' : 'small'
    return (
      <View style={styles.contentContainer}>
        {this.props.forProfile && this.props.editable &&
          <TrashCan touchTrash={this._touchTrash} touchEdit={this._touchEdit} />
        }
        {!this.props.showReadMessage && this.renderTopSection()}
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
        />
        {this.props.showReadMessage && this.renderTopSection()}
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
