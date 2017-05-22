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
    forProfile: PropTypes.bool,
    height: PropTypes.number,
    isLiked: PropTypes.bool,
    showLike: PropTypes.bool,
    autoPlayVideo: PropTypes.bool,
    allowVideoPlay: PropTypes.bool
  }

  static defaultProps = {
    showLike: true
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

  render () {
    const { story, user } = this.props
    const {
      id: userId,
      username,
      profile
    } = user;
    const {
      title,
      description,
      counts
    } = story;

    const userContent = (
      <View style={styles.row}>
        <Avatar
          style={styles.avatar}
          avatarUrl={getImageUrl(profile.avatar)}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
    )

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
          >
            <View style={styles.contentWrapper}>
            <Text style={[styles.title, this.props.titleStyle]}>{_.upperCase(title)}</Text>
            {!this.props.forProfile && <Text style={[styles.subtitle, this.props.subTitleStyle]}>{description}</Text>}
            {!this.props.forProfile && <View style={styles.divider} />}
            <View style={styles.detailContainer}>
              {!this.props.forProfile && this.props.onPressUser &&
                <TouchableOpacity onPress={() => this.props.onPressUser(userId)}>
                  {userContent}
                </TouchableOpacity>
              }
              {!this.props.forProfile && !this.props.onPressUser && userContent}
              {this.props.forProfile && this.props.showLike &&
                <View style={styles.row}>
                  <Text style={[styles.subtitle, this.props.subtitleStyle]}>{description}</Text>
                  <LikesComponent
                    onPress={this._onPressLike}
                    numberStyle={styles.bottomRight}
                    likes={formatCount(counts.likes)}
                    isLiked={this.props.isLiked}
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
                    isLiked={this.props.isLiked}
                  />
                </View>
              }
            </View>
              {!this.props.forProfile &&
                <View style={styles.readMore}>
                  <Text style={styles.readMoreText}>READ <Icon name='angle-up' size={18} /></Text>
                </View>
              }
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
