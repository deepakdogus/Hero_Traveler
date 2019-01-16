import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import UserActions, { getFollowers } from '../../Shared/Redux/Entities/Users'
import FollowFollowingRow from '../../Components/FollowFollowingRow'
import styles from './SignupSocialStyles'

class SignupSocialScreen extends React.Component {
  static propTypes = {
    loadSuggestedPeople: PropTypes.func,
    myFollowedUsers: PropTypes.array,
    sessionUser: PropTypes.object,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    users: PropTypes.object,
    suggestedUsersById: PropTypes.array,
  }

  componentDidMount() {
    this.props.loadSuggestedPeople()
  }

  userIsFollowed(userId) {
    return _.includes(this.props.myFollowedUsers, userId)
  }

  render() {
    let content
    const { sessionUser, followUser, unfollowUser } = this.props
    if (_.values(this.props.users).length) {
      content = (
        <View style={styles.lightBG}>
          <Text style={styles.sectionHeader}>SUGGESTED PEOPLE</Text>
          <View>
            {_.map(this.props.suggestedUsersById).map(uid => {
              const user = this.props.users[uid]
              return (
                <FollowFollowingRow
                  isSignup
                  key={user.id}
                  sessionUserId={sessionUser.id}
                  user={user}
                  isFollowing={this.userIsFollowed(user.id)}
                  followUser={followUser}
                  unfollowUser={unfollowUser}
                />
              )
            })}
          </View>
        </View>
      )
    }
    else {
      content = <Text>No users yet</Text>
    }

    return (
      <ScrollView style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.header}>
          <Text style={styles.title}>FOLLOW</Text>
          <Text style={styles.subtitle}>Follow people to see their trips</Text>
        </View>
        {content}
      </ScrollView>
    )
  }

  toggleFollow = u => {
    const isSelected = this.userIsSelected(u)
    if (!isSelected) {
      this.props.followUser(u.id)
    }
    else {
      this.props.unfollowUser(u.id)
    }
  }
}

const mapStateToProps = state => {
  const users = state.entities.users.entities
  const sessionUserId = state.session.userId
  return {
    sessionUser: users[sessionUserId],
    users,
    suggestedUsersById: state.entities.users.suggestedUsersById,
    myFollowedUsers: getFollowers(
      state.entities.users,
      'following',
      sessionUserId,
    ),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadSuggestedPeople: () =>
      dispatch(UserActions.loadUserSuggestionsRequest()),
    followUser: (sessionUserId, userIdToFollow) =>
      dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
    unfollowUser: (sessionUserId, userIdToUnfollow) =>
      dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupSocialScreen)
