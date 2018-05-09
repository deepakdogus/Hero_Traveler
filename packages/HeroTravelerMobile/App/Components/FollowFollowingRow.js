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
  }

  _navToProfile = () => {
    const {sessionUserId, user} = this.props
    const payload = { userId: user.id }
    if (sessionUserId === user.id) navToProfile(payload)
    else NavActions.readOnlyProfile(payload)
  }

  toggleFollow = () => {
    const {followUser, unfollowUser, user, sessionUserId, isFollowing} = this.props
    if (isFollowing) unfollowUser(sessionUserId, user.id)
    else followUser(sessionUserId, user.id)
  }

  render() {
    const {user, isFollowing, navToProfile, sessionUserId, isSignup} = this.props
    const {_navToProfile, toggleFollow} = this

    const Touchable = isSignup ? View : TouchableOpacity
    let followingText
    if (isFollowing) followingText = 'FOLLOWING'
    else if (user.id !== sessionUserId) followingText = 'FOLLOW'

    return (
      <View style={styles.rowWrapper}>
        <View style={styles.row}>
          <Touchable
            onPress={isSignup ? null : _navToProfile}
            style={styles.avatarAndName}
          >
            <Avatar
              style={styles.avatar}
              avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
            />
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>{user.profile.fullName}</Text>
              <Text style={styles.followerCount}>{user.counts.followers} followers</Text>
            </View>
          </Touchable>
          {followingText &&
            <RoundedButton
              style={isFollowing ? styles.selectedFollowersButton : styles.followersButton}
              textStyle={isFollowing ? styles.selectedFollowersButtonText : styles.followersButtonText}
              text={followingText}
              onPress={toggleFollow}
            />
          }
        </View>
      </View>
    )
  }
}

export default FollowFollowingRow
