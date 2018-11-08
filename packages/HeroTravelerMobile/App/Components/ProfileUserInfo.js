import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import styles from './Styles/ProfileViewStyles'
import { Colors } from '../Shared/Themes'
import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'

import TabIcon from './TabIcon'
import Avatar from './Avatar'

import { 
  roleToIconName,
  hasBadge,
} from '../Shared/Lib/badgeHelpers'


export default class ProfileUserInfo extends Component {
  static propTypes = {
    user: PropTypes.object,
    editable: PropTypes.bool,
    isFollowing: PropTypes.bool,
    onPressFollow: PropTypes.func,
    onPressUnfollow: PropTypes.func,
    usernameText: PropTypes.string,
    setUsername: PropTypes.func,
    aboutText: PropTypes.string,
    setAbout: PropTypes.func,
  }

  _navToSettings = () => NavActions.settings({type: 'push'})

  _navToEditProfile = () => NavActions.edit_profile()

  _navToViewBio = () => NavActions.viewBioScreen({ user: this.props.user })

  _navToFollowers = () => {
    NavActions.followersScreen({
      title: 'Followers',
      followersType: 'followers',
      userId: this.props.user.id
    })
  }

  _navToFollowing = () => {
    NavActions.followersScreen({
      title: 'Following',
      followersType: 'following',
      userId: this.props.user.id
    })
  }

  renderTop() {
    const {editable} = this.props
    if (editable) return (
      <View style={styles.topRightContainer}>
        <TouchableOpacity onPress={this._navToEditProfile} style={styles.editButton}>
          <TabIcon
            name='pencil'
            style={{ image: styles.pencilImageIcon }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this._navToSettings}>
          <TabIcon
            name='gear'
            style={{ image: styles.cogImageIcon }}
          />
        </TouchableOpacity>
      </View>
    )
    else return (<View style={styles.readingViewTop}></View>)
  }

  renderUserInfo() {
    const {user} = this.props
    return (
      <View style={styles.userInfoWrapper}>
        <Text style={styles.titleText}>{user.username}</Text>
        <Text style={styles.italicText}>{user.profile.fullName}</Text>
        {!!(user.about) &&
          <Text
            style={styles.aboutText}
            numberOfLines={3}
            ellipsizeMode={'tail'}
          >
            {user.about}
          </Text>
        }
        <TouchableOpacity onPress={this._navToViewBio}>
          <Text style={styles.readBioText}>Read Bio</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderButtons() {
    const {editable, isFollowing, onPressUnfollow, onPressFollow} = this.props
    if (editable) return null
    else return (
      <TouchableOpacity
        style={[
          styles.blackButton,
          isFollowing ? null : styles.followButton
        ]}
        onPress={isFollowing ? onPressUnfollow : onPressFollow}>
        <Text
          style={[
            styles.blackButtonText,
            isFollowing ? null : styles.followButtonText
          ]}
        >
          {isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
        </Text>
      </TouchableOpacity>
    )
  }

  renderFirstRow() {
    const {user} = this.props

    const avatarUrl = getImageUrl(user.profile.avatar, 'avatar')

    return (
      <View style={styles.profileWrapper}>
        <View style={styles.avatarWrapper}>
          <Avatar
            size='extraLarge'
            avatarUrl={avatarUrl}
          />
        </View>
        <View style={styles.userInfoMargin}>
          {this.renderUserInfo()}
        </View>
      </View>
    )
  }

  renderSecondRow(){
    const {user} = this.props
    return (
      <View style={[styles.profileWrapper, styles.secondRow]}>
        <View style={styles.followersWrapper}>
          <View>
            <TouchableOpacity onPress={this._navToFollowers}>
              <Text style={styles.followerNumber}>{formatCount(user.counts.followers)}</Text>
              <Text style={styles.followerLabel}>Followers</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.followingColumn}>
            <TouchableOpacity onPress={this._navToFollowing}>
              <Text style={styles.followerNumber}>{formatCount(user.counts.following)}</Text>
              <Text style={styles.followerLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {this.renderButtons()}
        </View>
      </View>
    )
  }

  renderBadgeRow(){
    return (
      <View style={[styles.profileWrapper, styles.badgeRow]}>
        <TabIcon
          name={roleToIconName[user.role]}
          style={{ image: styles.badgeImage }}
        />
        <Text style={styles.badgeText}>
          {this.props.user.role.toUpperCase()}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.profileInfoContainer}>
        {this.renderTop()}
        {this.renderFirstRow()}
        // @ Matthew will the below new syntax work here? Also, ellipses instead of brackets?
        {this.hasBadge(user.role) && this.renderBadgeRow()}
        {this.renderSecondRow()}
      </View>
    )
  }
}
