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

import UserActions, {getFollowers, getFollowersFetchStatus} from '../Shared/Redux/Entities/Users'
import Loader from '../Components/Loader'
import RoundedButton from '../Components/RoundedButton'
import Avatar from '../Components/Avatar'
import {Colors} from '../Shared/Themes'
import styles from './Signup/SignupSocialStyles'
import getImageUrl from '../Shared/Lib/getImageUrl'

class FollowersScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      usersById: props.usersById
    }
  }

  static propTypes = {
    followers: PropTypes.array,
    followersType: PropTypes.oneOf(['followers', 'following']).isRequired,
    loadDataAction: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.props.loadData()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.usersById.length !== this.props.usersById.length) {
      this.setState({usersById: nextProps.usersById})
    }
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
    if (this.state.fetchStatus && this.state.fetchStatus.loading) {
      return (
        <Loader
          style={styles.spinner}
          tintColor={Colors.blackoutTint}
          spinnerColor={Colors.snow}
        />
      )
    }

    if (this.state.usersById.length) {
      content = (
        <View style={styles.followers}>
          {_.map(this.state.usersById, uid => {
            const u = this.props.users[uid]
            const selected = this.userIsFollowed(u.id)
            let followingText

            if (uid === this.props.user.id) {
              followingText = 'YOU'
            } else if (selected) {
              followingText = 'FOLLOWING'
            } else {
              followingText = 'FOLLOW'
            }

            return (
              <View style={[styles.rowWrapper]} key={u.id}>
                <View style={[styles.row, styles.followers]}>
                  <TouchableOpacity onPress={() => NavActions.readOnlyProfile({userId: u.id})}>
                  <Avatar
                    style={styles.avatar}
                    avatarUrl={getImageUrl(u.profile.avatar, 'avatar')}
                  />
                  </TouchableOpacity>
                  <View style={styles.nameWrapper}>
                    <Text style={styles.name}>{u.profile.fullName}</Text>
                    <Text style={styles.followerCount}>{u.counts.followers} followers</Text>
                  </View>
                  <RoundedButton
                    style={selected ? styles.selectedFollowersButton : styles.followersButton}
                    textStyle={selected ? styles.selectedFollowersButtonText : styles.followersButtonText}
                    text={followingText}
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
      <ScrollView style={[styles.containerWithNavbar, styles.lightBG]}>
        {content}
      </ScrollView>
    )
  }

  toggleFollow = (u) => {

    // Cannot follow yourself
    if (this.props.user.id === u.id) {
      return
    }

    if (this.userIsFollowed(u.id)) {
      this.props.unfollowUser(this.props.user.id, u.id)
    } else {
      this.props.followUser(this.props.user.id, u.id)
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
    followUser: (userId, userIdToFollow) => dispatch(UserActions.followUser(userId, userIdToFollow)),
    unfollowUser: (userId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(userId, userIdToUnfollow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersScreen)
