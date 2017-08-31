import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
import { connect } from 'react-redux'

import {Colors} from '../Shared/Themes'
import UserActions, {getFollowers} from '../Shared/Redux/Entities/Users'
import StoryActions, {getByUser, getUserFetchStatus} from '../Shared/Redux/Entities/Stories'
import ProfileView from '../Components/ProfileView'
import Loader from '../Components/Loader'
import getImageUrl from '../Shared/Lib/getImageUrl'
import styles from './Styles/ProfileScreenStyles'


class ReadOnlyProfileScreen extends Component {

  static propTypes = {
    userId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.props.attemptRefreshUser(this.props.userId)
    this.props.attemptGetUserStories(this.props.userId)
  }

  render () {
    const {
      user,
      storiesById,
      userFetchStatus,
      storiesFetchStatus
    } = this.props

    if (userFetchStatus.loading || !user) {
      return (
        <Loader
          style={styles.spinner}
          tintColor={Colors.blackoutTint}
          spinnerColor={Colors.snow}
        />
      )
    }

    return (
      <ProfileView
        user={user}
        stories={storiesById}
        editable={false}
        hasTabbar={false}
        profileImage={getImageUrl(user.profile.cover)}
        fetchStatus={storiesFetchStatus}
        onPressFollow={this.follow}
        onPressUnfollow={this.unfollow}
        isFollowing={_.includes(this.props.myFollowedUsers, user.id)}
        style={styles.root}
      />
    )
  }

  follow = () => {
    this.props.followUser(this.props.authedUser.id, this.props.user.id)
  }

  unfollow = () => {
    this.props.unfollowUser(this.props.authedUser.id, this.props.user.id)
  }
}

const mapStateToProps = (state, props) => {
  const users = state.entities.users
  const authedUser = users.entities[state.session.userId]
  return {
    authedUser,
    user: users.entities[props.userId],
    storiesById: getByUser(state.entities.stories, props.userId),
    storiesFetchStatus: getUserFetchStatus(state.entities.stories, props.userId),
    userFetchStatus: users.fetchStatus,
    myFollowedUsers: getFollowers(users, 'following', authedUser.id)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    attemptRefreshUser: (userId) => dispatch(UserActions.loadUser(userId)),
    followUser: (userId, userIdToFollow) => dispatch(UserActions.followUser(userId, userIdToFollow)),
    unfollowUser: (userId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(userId, userIdToUnfollow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadOnlyProfileScreen)
