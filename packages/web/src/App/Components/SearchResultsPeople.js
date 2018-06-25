import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import FollowFollowingRow from './FollowFollowingRow'

const Container = styled.div`
  margin-top: 50px;
`

export default class SearchResultsPeople extends Component {
  static PropTypes = {
    userSearchResults: PropTypes.object,
    userFollowing: PropTypes.array,
    userId: PropTypes.string,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    navToUserProfile: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const users = this.props.userSearchResults.hits || []
    const {userFollowing, userId} = this.props
    const renderedUsers = users.map((user, index)=> {
      const isFollowing = userFollowing[userId] ? userFollowing[userId].byId.includes(user.objectID) : false
      return (
        <FollowFollowingRow
          key={index}
          user={user}
          type='follow'
          isFollowing={isFollowing}
          onFollowClick={isFollowing ? this.props.unfollowUser : this.props.followUser}
          onProfileClick={this.props.navToUserProfile}
          userId={userId}
        />
      )
    })

    return (
      <Container>
        {renderedUsers}
      </Container>
    )
  }
}

