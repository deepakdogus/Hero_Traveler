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
import styles from '../Containers/Signup/SignupSocialStyles'

class BackgroundPublishingBars extends Component {
  static propTypes = {
    sessionUserId: PropTypes.string,
    user: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
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
    const {followUser, unfollowUser, user, sessionUserId, selected} = this.props
    if (selected) unfollowUser(sessionUserId, user.id)
    else followUser(sessionUserId, user.id)
  }

  render() {
    const {user, selected, navToProfile, sessionUserId} = this.props
    const {_navToProfile, toggleFollow} = this

    let followingText
    if (selected) followingText = 'FOLLOWING'
    else if (user.id !== sessionUserId) followingText = 'FOLLOW'

    return (
      <View style={styles.rowWrapper}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={_navToProfile}
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
          </TouchableOpacity>
          {followingText &&
            <RoundedButton
              style={selected ? styles.selectedFollowersButton : styles.followersButton}
              textStyle={selected ? styles.selectedFollowersButtonText : styles.followersButtonText}
              text={followingText}
              onPress={toggleFollow}
            />
          }
        </View>
      </View>
    )
  }
}

export default BackgroundPublishingBars
