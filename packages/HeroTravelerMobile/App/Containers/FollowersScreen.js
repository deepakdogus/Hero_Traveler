import React, { PropTypes } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import {connect} from 'react-redux'
import _ from 'lodash'

// TODO create redux action to load followers or else load all users and filter for followers
// on the front end.

import UserActions, {getFollowers, getFollowersFetchStatus} from '../Redux/Entities/Users'
import Loader from '../Components/Loader'
import RoundedButton from '../Components/RoundedButton'
import Avatar from '../Components/Avatar'
import {Colors} from '../Themes'
import NavBar from './CreateStory/NavBar'
import styles from './Signup/SignupSocialStyles'

class FollowersScreen extends React.Component {

  static propTypes = {
    followers: PropTypes.array,
    followersType: PropTypes.oneOf(['followers', 'following']).isRequired,
    loadDataAction: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.props.loadData()
  }

  userIsFollowed(userId: string) {
    return _.includes(this.props.myFollowedUsers, userId)
  }

  renderEmptyMessage(msg: string) {
    return (
      <View style={styles.emptyMessage}>
        <Text style={styles.emptyMessageText}>{msg}</Text>
        <RoundedButton
          style={styles.emptyMessageBtn}
          onPress={this.props.onLeft}>Back</RoundedButton>
      </View>
    )
  }

  render () {
    let content

    if (this.props.fetchStatus.loading) {
      return (
        <Loader
          style={styles.spinner}
          tintColor={Colors.blackoutTint}
          spinnerColor={Colors.snow}
        />
      )
    }

    if (this.props.usersById.length) {
      content = (
        <View style={styles.followers}>
          {_.map(this.props.usersById, uid => {
            const u = this.props.users[uid]
            const selected = this.userIsFollowed(u.id)
            return (
              <View style={[styles.rowWrapper]} key={u.id}>
                <View style={[styles.row, styles.followers]}>
                  <TouchableOpacity onPress={() => NavActions.readOnlyProfile({userId: u.id})}>
                  <Avatar
                    style={styles.avatar}
                    avatarUrl={u.profile.avatar}
                  />
                  </TouchableOpacity>
                  <View style={styles.nameWrapper}>
                    <Text style={styles.name}>{u.profile.fullName}</Text>
                    <Text style={styles.followerCount}>{u.counts.following} followers</Text>
                  </View>
                  <RoundedButton
                    style={selected ? styles.selectedFollowersButton : styles.followersButton}
                    textStyle={selected ? styles.selectedFollowersButtonText : styles.followersButtonText}
                    text={selected ? 'FOLLOWING' : '+ FOLLOW'}
                    onPress={() => this.toggleFollow(u)}
                  />
                </View>
              </View>
            )
          })}
        </View>
      )
    } else if (this.props.followersType === 'followers') {
      // If the authenticated user is viewing another users followers
      content = this.renderEmptyMessage('No followers found')
    } else {
      content = this.renderEmptyMessage('Not following any users')
    }

    return (
      <ScrollView style={[styles.containerWithNavbar, styles.root, styles.lightBG]}>
        {content}
      </ScrollView>
    )
  }

  toggleFollow = (u) => {
    if (!this.userIsFollowed(u)) {
      this.props.followUser(this.props.user.id, u.id)
    } else {
      this.props.unfollowUser(this.props.user.id, u.id)
    }
  }
}

const mapStateToProps = (state, props) => {
  const {users} = state.entities
  const authedUserId = state.session.userId

  return {
    users: users.entities,
    user: users.entities[authedUserId],
    usersById: getFollowers(users, props.followersType, props.userId),
    fetchStatus: getFollowersFetchStatus(users, props.followersType, props.userId),
    myFollowedUsers: getFollowers(users, 'following', authedUserId)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadData: () => dispatch(props.loadDataAction(props.userId)),
    followUser: (userId, userIdToFollow) => console.log('dispatch follow user'),
    unfollowUser: (userId, userIdToUnfollow) => console.log('dispatch unfollow user'),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersScreen)
