import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavActions } from 'react-native-router-flux'

import styles from './Styles/ProfileViewStyles'
import { Colors } from '../Shared/Themes'
import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'
import UserActions from '../Shared/Redux/Entities/Users'

import TabIcon from './TabIcon'
import Avatar from './Avatar'

const usernameContansts = {
  maxLength: 20,
  minLength: 2,
}

export default class ProfileUserInfo extends Component {
  static propTypes = {
    user: PropTypes.object,
    editable: PropTypes.bool,
    isEditing: PropTypes.bool,
    isFollowing: PropTypes.bool,
    onPressFollow: PropTypes.func,
    onPressUnfollow: PropTypes.func,
    handleUpdateAvatarPhoto: PropTypes.func,
    usernameText: PropTypes.string,
    setUsername: PropTypes.func,
  }

  _navToSettings = () => NavActions.settings({type: 'push'})

  _navToEditProfile = () => NavActions.edit_profile()

  _navToViewBio = () => NavActions.viewBioScreen({ user: this.props.user })

  _navToFollowers = () => {
    NavActions.followersScreen({
      title: 'Followers',
      followersType: 'followers',
      loadDataAction: UserActions.loadUserFollowers,
      userId: this.props.user.id
    })
  }

  _navToFollowing = () => {
    NavActions.followersScreen({
      title: 'Following',
      followersType: 'following',
      loadDataAction: UserActions.loadUserFollowing,
      userId: this.props.user.id
    })
  }

  _selectAvatar = () => {
    NavActions.mediaSelectorScreen({
      mediaType: 'photo',
      title: 'Edit Avatar',
      titleStyle: {color: Colors.white},
      leftTitle: 'Cancel',
      leftTextStyle: {color: Colors.white},
      onLeft: () => NavActions.pop(),
      rightTitle: 'Done',
      rightIcon: 'none',
      onSelectMedia: this.props.handleUpdateAvatarPhoto
    })
  }

  renderTop() {
    const {isEditing, editable} = this.props
    if (isEditing) return null
    else if (editable) return (
      <View style={styles.cogContainer}>
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

  renderNames() {
    const {isEditing, user, usernameText, setUsername} = this.props
    if (isEditing) return (
      <View style={styles.userInfoWrapper}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <TextInput
            placeholder={user.username}
            value={usernameText}
            autoCapitalize='none'
            style={[styles.titleText, styles.editTitle]}
            onChangeText={setUsername}
            maxLength={usernameContansts.maxLength}
            minLength={usernameContansts.minLength}
            returnKeyType={'done'}
          />
          <TabIcon
            name='pencil'
            style={{
              view: styles.editPencilView,
              image: styles.editPencilImage,
            }}
          />
        </View>
      </View>
    )

    return (
      <View style={styles.userInfoWrapper}>
        <View>
          <Text style={styles.titleText}>{user.username}</Text>
          <Text style={styles.italicText}>{user.profile.fullName}</Text>
        </View>
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
      </View>
    )
  }

  renderButtons() {
    const {isEditing, editable, isFollowing, onPressUnfollow, onPressFollow} = this.props
    if (isEditing) return null
    else if (editable) return (
      <TouchableOpacity
        style={styles.blackButton}
        onPress={this._navToEditProfile}>
        <Text style={styles.blackButtonText}>EDIT PROFILE</Text>
      </TouchableOpacity>
    )
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

  renderLeftColumn() {
    const {isEditing, user} = this.props

    const avatarOverlay = isEditing ? (
      <TouchableOpacity
        style={styles.addAvatarPhotoButton}
        onPress={this._selectAvatar}
      >
        <Icon
          name='camera'
          size={32.5}
          color={Colors.whiteAlphaPt80}
          style={styles.updateAvatorIcon} />
      </TouchableOpacity>
    ) : null

    const avatarUrl = (isEditing && user.profile.tempAvatar) ?
      getImageUrl(user.profile.tempAvatar, 'avatar') :
      getImageUrl(user.profile.avatar, 'avatar')

    return (
      <View>
        <View style={{position: 'relative'}}>
          <Avatar
            size='extraLarge'
            avatarUrl={avatarUrl}
          />
          {avatarOverlay}
        </View>
        {!isEditing &&
          <TouchableOpacity onPress={this._navToViewBio} style={styles.bioButton}>
            <Text style={styles.readBioText}>Bio</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }

  renderRightColumn() {
    return (
      <View style={styles.userInfoMargin}>
        {this.renderNames()}
        {this.renderButtons()}
      </View>
    )
  }

  render() {
    const {isEditing} = this.props

    return (
      <View style={isEditing ? styles.profileEditInfoContainer : styles.profileInfoContainer}>
        {this.renderTop()}
        <View style={styles.profileWrapper}>
          {this.renderLeftColumn()}
          {this.renderRightColumn()}
        </View>
      </View>
    )
  }
}
