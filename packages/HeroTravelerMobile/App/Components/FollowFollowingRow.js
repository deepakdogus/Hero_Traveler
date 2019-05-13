import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import Avatar from './Avatar'
import RoundedButton from './RoundedButton'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {navToProfile} from '../Navigation/NavigationRouter'
import styles from './Styles/FollowFollowingRowStyles'

class FollowFollowingRow extends Component {
  static propTypes = {
    isSignup: PropTypes.bool,
    sessionUserId: PropTypes.string,
    user: PropTypes.object.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    addUserToSearchHistory: PropTypes.func,
    styledInset: PropTypes.bool,
  }

  _navToProfile = () => {
    const {sessionUserId, user, addUserToSearchHistory} = this.props
    const userId = user.id || user._id
    if (addUserToSearchHistory) addUserToSearchHistory(user)
    if (sessionUserId === userId) navToProfile({ userId })
    else NavActions.readOnlyProfile({ userId })
  }

  toggleFollow = () => {
    const {followUser, unfollowUser, user, sessionUserId, isFollowing} = this.props
    if (isFollowing) unfollowUser(sessionUserId, user.id)
    else followUser(sessionUserId, user.id)
  }

  render() {
    const {user, isFollowing, sessionUserId, isSignup, styledInset} = this.props
    const Touchable = isSignup ? View : TouchableOpacity

    const [ userAvatar, userFullName ] = user && user.profile
      ? [user.profile.avatar, user.profile.fullName]
      : [undefined, undefined]

    let followingText

    if (isFollowing) followingText = 'FOLLOWING'
    else if (user.id !== sessionUserId) followingText = 'FOLLOW'

    return (
      <View style={[
        styles.rowWrapper,
        styledInset && styles.rowWrapperInset,
      ]}>
        <View style={[
          styles.row,
          styledInset && styles.rowWithHorizontalInset,
        ]}>
          <Touchable
            onPress={isSignup ? null : this._navToProfile}
            style={styles.avatarAndName}
          >
            <Avatar
              style={styles.avatar}
              avatarUrl={getImageUrl(userAvatar, 'avatar')}
            />
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>{userFullName}</Text>
              {!!user.counts && (
                <Text style={styles.followerCount}>{user.counts.followers} followers</Text>
              )}
            </View>
          </Touchable>
          {followingText && (
            <RoundedButton
              style={isFollowing ? styles.selectedFollowersButton : styles.followersButton}
              textStyle={isFollowing ? styles.selectedFollowersButtonText : styles.followersButtonText}
              text={followingText}
              onPress={this.toggleFollow}
            />
          )}
        </View>
      </View>
    )
  }
}

export default FollowFollowingRow
