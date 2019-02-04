import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {Colors} from '../Shared/Themes'
import UserActions, { getFollowers } from '../Shared/Redux/Entities/Users'
import StoryActions, {
  getByUser,
  getUserFetchStatus,
} from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import ProfileView, { TabTypes } from '../Components/ProfileView'
import Loader from '../Components/Loader'
import getImageUrl from '../Shared/Lib/getImageUrl'
import styles from './Styles/ProfileScreenStyles'

class ReadOnlyProfileScreen extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    attemptRefreshUser: PropTypes.func.isRequired,
    attemptGetUserStories: PropTypes.func.isRequired,
    attemptGetUserGuides: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    user: PropTypes.object,
    authedUser: PropTypes.object,
    storiesById: PropTypes.arrayOf(PropTypes.string),
    guideIds: PropTypes.arrayOf(PropTypes.string),
    userFetchStatus: PropTypes.object,
    storiesFetchStatus: PropTypes.object,
    guidesFetchStatus: PropTypes.object,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.string),
  }

  constructor(props) {
    super(props)
    this.initializeData()
  }

  initializeData = () => {
    const {
      attemptRefreshUser,
      attemptGetUserStories,
      attemptGetUserGuides,
      userId,
    } = this.props
    attemptRefreshUser(userId)
    attemptGetUserStories(userId)
    attemptGetUserGuides(userId)
  }

  _selectTab = (tab) => {
    switch (tab) {
      case TabTypes.stories:
        return this.props.attemptGetUserStories(this.props.userId)
      case TabTypes.guides:
        return this.props.attemptGetUserGuides(this.props.userId)
    }
  }

  render () {
    const {
      user,
      storiesById,
      userFetchStatus,
      storiesFetchStatus,
      guideIds,
      guidesFetchStatus,
      myFollowedUsers,
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

    if (!user || !user.profile) return null

    return (
      <ProfileView
        user={user}
        stories={storiesById}
        guideIds={guideIds}
        editable={false}
        hasTabbar={false}
        profileImage={getImageUrl(user.profile.cover, 'basic')}
        fetchStatus={storiesFetchStatus}
        guidesFetchStatus={guidesFetchStatus}
        onPressFollow={this.follow}
        onPressUnfollowz={this.unfollow}
        isFollowing={_.includes(myFollowedUsers, user.id)}
        style={styles.root}
        refresh={this.initializeData}
        onSelectTab={this._selectTab}
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
  const {users, guides} = state.entities
  const authedUser = users.entities[state.session.userId]
  return {
    authedUser,
    user: users.entities[props.userId],
    storiesById: getByUser(state.entities.stories, props.userId),
    storiesFetchStatus: getUserFetchStatus(state.entities.stories, props.userId),
    guideIds: guides.guideIdsByUserId ? guides.guideIdsByUserId[props.userId] : [],
    guidesFetchStatus: guides.fetchStatus,
    userFetchStatus: users.fetchStatus,
    myFollowedUsers: getFollowers(users, 'following', authedUser.id),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserGuides: (userId) => dispatch(GuideActions.getUserGuides(userId)),
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    attemptRefreshUser: (userId) => dispatch(UserActions.loadUser(userId)),
    followUser: (userId, userIdToFollow) => dispatch(UserActions.followUser(userId, userIdToFollow)),
    unfollowUser: (userId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(userId, userIdToUnfollow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadOnlyProfileScreen)
