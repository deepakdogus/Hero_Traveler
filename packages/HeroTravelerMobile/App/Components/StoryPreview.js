import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight } from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'


import formatCount from '../Lib/formatCount'
import getImageUrl from '../Lib/getImageUrl'
import getVideoUrl from '../Lib/getVideoUrl'
import { Metrics, Colors } from '../Themes'
import styles from './Styles/StoryPreviewStyle'
import LikesComponent from './LikeComponent'
import TrashCan from '../Components/TrashCan'
import Avatar from './Avatar'
import StoryCover from './StoryCover'


export default class StoryPreview extends Component {
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
    gradientColors: PropTypes.arrayOf(PropTypes.string)
  }

  static defaultProps = {
    showLike: true,
    showReadMessage: false
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

  _touchEdit = () => {
    if (this.props.touchEdit) {
      this.props.touchEdit(this.props.story.id)
    }
  }

  _touchTrash = () => {
    if (this.props.touchTrash) {
      this.props.touchTrash(this.props.story.id)
    }
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
          avatarUrl={getImageUrl(user.profile.avatar)}
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

  render () {
    const {story} = this.props
    return (
        <View style={{height: this.props.height || Metrics.screenHeight - Metrics.navBarHeight - 20}}>
        <View style={styles.contentContainer}>
          {this.props.forProfile && this.props.editable &&
            <TrashCan touchTrash={this._touchTrash} touchEdit={this._touchEdit} />
          }
          <StoryCover
            autoPlayVideo={this.props.autoPlayVideo}
            allowVideoPlay={this.props.allowVideoPlay}
            cover={story.coverImage ? story.coverImage : story.coverVideo}
            coverType={story.coverImage ? 'image' : 'video'}
            onPress={this.props.onPress}
            gradientColors={this.props.gradientColors}
          >
            <View style={styles.contentWrapper}>
              {this.props.forProfile && this.renderProfileTitleSection()}
              {!this.props.forProfile && this.renderTitleSection()}
            </View>
          </StoryCover>
        </View>
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
