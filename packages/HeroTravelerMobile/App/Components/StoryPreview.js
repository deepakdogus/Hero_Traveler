import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'

import formatCount from '../Shared/Lib/formatCount'
import getImageUrl from '../Shared/Lib/getImageUrl'
import { Metrics } from '../Shared/Themes'
import styles from './Styles/StoryPreviewStyle'
import {styles as storyReadingStyles} from '../Containers/Styles/StoryReadingScreenStyles'
import LikesComponent from './LikeComponent'
import TrashCan from '../Components/TrashCan'
import Avatar from './Avatar'
import StoryCover from './StoryCover'
import FadeInOut from './FadeInOut'
import TabIcon from './TabIcon'

export default class StoryPreview extends Component {
  // is showLike now always true? MBT - 12/07
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

  renderProfileTitleSection() {
    const {story} = this.props
    return (
      <View>
        <Text style={[styles.title, this.props.titleStyle]}>{_.upperCase(story.title)}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.subtitle, this.props.subtitleStyle]}>{story.description}</Text>
          <LikesComponent
            onPress={this._onPressLike}
            likes={formatCount(story.counts.likes)}
            isLiked={this.props.isLiked}
          />
        </View>
      </View>
    )
  }

  renderTitleSection() {
    const {story} = this.props
    return (
      <View>
        <Text style={[styles.title, this.props.titleStyle]}>{_.upperCase(story.title)}</Text>
        <Text style={[styles.subtitle, this.props.subtitleStyle]}>{story.description}</Text>
        <View style={styles.divider} />
        <View style={styles.detailsContainer}>
          {this.renderUserContent()}
          <View style={styles.detailsRight}>
            <Text style={[
              styles.dateText,
              this.props.showLike && {marginRight: Metrics.section}
            ]}>
              {moment(story.createdAt).fromNow()}
            </Text>
            {this.props.showLike &&
              <LikesComponent
                onPress={this._onPressLike}
                likes={formatCount(story.counts.likes)}
                isLiked={this.props.isLiked}
              />
            }
          </View>
        </View>
        {this.props.showReadMessage &&
          <View style={styles.readMore}>
            <Text style={styles.readMoreText}>READ <Icon name='angle-up' size={16} /></Text>
          </View>
        }
      </View>
    )
  }

  renderUserContent() {
    const {user} = this.props

    const userContent = (
      <View style={styles.userContent}>
        <Avatar
          style={styles.avatar}
          avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
        />
        <Text style={styles.username}>{user.username}</Text>
      </View>
    )

    if (this.props.onPressUser) {
      return (
        <TouchableOpacity onPress={this._touchUser}>
          {userContent}
        </TouchableOpacity>
      )
    }

    return userContent
  }

  renderTopSection() {
    const {user, story} = this.props

    return (
      <View style={[styles.storyInfoContaier, styles.verticalCenter, styles.topContainer]}>
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
    const {categories, title, counts} = this.props.story
    const storyCategories = categories.reduce((string, category, index) => {
      if (index === 0) string += category.title
      else string += `, ${category.title}`
      return string
    }, "")

    return (
      <View style={[styles.storyInfoContaier, styles.bottomContainer]}>
        {
          // <Text style={storyReadingStyles.tag}>{storyCategories}</Text>
        }
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
    const {story, isContentVisible} = this.props
    if (!story) return null
    // using StoryPreview height as proxy for StoryCover playbutton size
    const height = this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20
    const playButtonSize = height > 250 ? 'large' : 'small'
    return (
      <View style={styles.contentContainer}>
        {this.props.showReadMessage && <View style={styles.readingBuffer}/>}
        {this.props.forProfile && this.props.editable &&
          <TrashCan touchTrash={this._touchTrash} touchEdit={this._touchEdit} />
        }
        {this.renderTopSection()}
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
        >
          {
          // pending approval to remove all of this and related methods + styles
          // <FadeInOut
          //   isVisible={isContentVisible}
          //   style={styles.contentWrapper}
          // >
          //   {this.props.forProfile ? this.renderProfileTitleSection() : this.renderTitleSection()}
          // </FadeInOut>
          }
        </StoryCover>
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
