import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'

import FollowFollowingRow from './FollowFollowingRow'

const Container = styled.div`
  max-width: 800px;
  padding: 0 30px;
  margin: 55px auto 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 35px auto 0;
    padding: 0 15px;
  }
`

export default class SearchResultsPeople extends Component {
  static propTypes = {
    userSearchResults: PropTypes.object,
    userFollowing: PropTypes.object,
    userId: PropTypes.string,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    navToUserProfile: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const users = this.props.userSearchResults.hits || []
    const {userFollowing, userId} = this.props
    const renderedUsers = users.map((user, index)=> {
      const isFollowing = _.get(userFollowing, `${userId}.byId`)
        ? userFollowing[userId].byId.includes(user.objectID)
        : false
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
