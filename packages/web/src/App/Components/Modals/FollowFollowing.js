import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import _ from 'lodash'

import UserActions, {getFollowers, getFollowersFetchStatus} from '../../Shared/Redux/Entities/Users'

import FollowFollowingRow from '../FollowFollowingRow'
import {RightTitle, RightModalCloseX} from './Shared'

const Container = styled.div``

const UserRowsContainer = styled.div`
  padding: 25px;
`

class FollowFollowing extends Component {
  static propTypes = {
    profile: PropTypes.object,
    closeModal: PropTypes.func,
    followersType: PropTypes.oneOf(['followers', 'following']).isRequired,

    sessionUserId: PropTypes.string,
    users: PropTypes.object,
    usersById: PropTypes.arrayOf(PropTypes.object),
    fetchStatus: PropTypes.object,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.object),

    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    loadUserFollowedBy: PropTypes.func,
    loadUserFollowing: PropTypes.func,
    reroute: PropTypes.func,
  }

  componentWillMount() {
    const {followersType, loadUserFollowedBy, loadUserFollowing, profile, myFollowedUsers, sessionUserId} = this.props
    if (followersType === 'followers') loadUserFollowedBy(profile.id)
    else loadUserFollowing(profile.id)

    if (!myFollowedUsers) loadUserFollowing(sessionUserId)
  }

  getNoUsersText = () => {
    const {followersType, profile} = this.props
    if (followersType === 'followers') {
      return `${profile.username} has no followers`
    }
    else {
      return `${profile.username} is not following anybody`
    }
  }

  navToProfile = (userId) => {
    this.props.closeModal()
    this.props.reroute(`/profile/${userId}/view`)
  }

  renderUserRows = (ids) => {
    const {myFollowedUsers, sessionUserId} = this.props
    return ids.map((id, index) => {
      const isFollowing = _.includes(myFollowedUsers, id)
      const isYou = id === sessionUserId
      return (
        <FollowFollowingRow
          key={id}
          user={this.props.users[id]}
          isFollowing={isFollowing}
          isYou={isYou}
          onFollowClick={isFollowing ? this._unfollowUser : this._followUser}
          onProfileClick={this.navToProfile}
          margin='0 0 25px'
        />
      )
    })
  }

  _followUser = (userIdToFollow) => {
    this.props.followUser(this.props.sessionUserId, userIdToFollow)
  }

  _unfollowUser = (userIdToUnfollow) => {
    this.props.unfollowUser(this.props.sessionUserId, userIdToUnfollow)
  }

  render() {
    const {profile, fetchStatus, usersById} = this.props

    if (fetchStatus && fetchStatus.loading){
      return (<p>LOADING - NEED TO ADD LOADER</p>)
    }
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>{profile.username.toUpperCase()} IS FOLLOWED BY</RightTitle>
        <UserRowsContainer>
          {usersById.length !== 0 && this.renderUserRows(usersById)}
          {usersById.length === 0 && <p>{this.getNoUsersText()}</p>}
        </UserRowsContainer>
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const profileId = ownProps.profile.id
  const users = state.entities.users
  const sessionUserId = state.session.userId
  const myFollowedUsersObject = users.userFollowingByUserIdAndId[sessionUserId]
  const myFollowedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined
  return {
    myFollowedUsers,
    sessionUserId,
    users: users.entities,
    usersById: getFollowers(users, ownProps.followersType, profileId),
    fetchStatus: getFollowersFetchStatus(users, ownProps.followersType, profileId),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    reroute: (route) => dispatch(push(route)),
    followUser: (sessionUserID, userIdToFollow) => dispatch(UserActions.followUser(sessionUserID, userIdToFollow)),
    unfollowUser: (sessionUserID, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserID, userIdToUnfollow)),
    loadUserFollowedBy: (userId) => dispatch(UserActions.loadUserFollowers(userId)),
    loadUserFollowing: (userId) => dispatch(UserActions.loadUserFollowing(userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowFollowing)
