import React from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'

import UserActions, {getFollowers, getFollowersFetchStatus} from '../Shared/Redux/Entities/Users'
import Loader from '../Components/Loader'
import FollowFollowingRow from '../Components/FollowFollowingRow'
import {Colors} from '../Shared/Themes'
import styles from './Signup/SignupSocialStyles'

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
    if (
      nextProps.userId !== this.props.userId
      || nextProps.followersType !== this.props.followersType
    ) {
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
      </View>
    )
  }

  render () {
    const {fetchStatus, usersById} = this.state
    const {users, sessionUserId, followUser, unfollowUser, followersType} = this.props
    if (fetchStatus && fetchStatus.loading) {
      return (
        <Loader
          style={styles.spinner}
          tintColor={Colors.blackoutTint}
          spinnerColor={Colors.snow}
        />
      )
    }

    let content
    if (usersById.length) {
      content = (
        <View style={styles.followers}>
          {
            _.map(usersById, uid => {
              const user = users[uid]
              return (
                <FollowFollowingRow
                  key={user.id}
                  sessionUserId={sessionUserId}
                  user={user}
                  isFollowing={this.userIsFollowed(user.id)}
                  followUser={followUser}
                  unfollowUser={unfollowUser}
                />
              )
            })
          }
        </View>
      )
    } else if (followersType === 'followers') {
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
}

const mapStateToProps = (state, props) => {
  const {users} = state.entities
  const sessionUserId = state.session.userId
  return {
    users: users.entities,
    sessionUserId,
    usersById: getFollowers(users, props.followersType, props.userId),
    fetchStatus: getFollowersFetchStatus(users, props.followersType, props.userId),
    myFollowedUsers: getFollowers(users, 'following', sessionUserId)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadData: () => dispatch(props.loadDataAction(props.userId)),
    followUser: (sessionUserId, userIdToFollow) => dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
    unfollowUser: (sessionUserId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersScreen)
