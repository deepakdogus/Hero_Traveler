import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import FollowFollowingRow from './FollowFollowingRow'
import { ItemContainer, ListTitle } from '../Containers/Search'

export default class SearchResultsPeople extends Component {
  static propTypes = {
    label: PropTypes.text,
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
    const {label, userFollowing, userId, userSearchResults} = this.props
    const users = userSearchResults.hits || userSearchResults.people || []
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
          divider={index !== 0 && index !== users.length}
        />
      )
    })

    return (
      <ItemContainer>
        {label && <ListTitle>{label}</ListTitle>}
        {renderedUsers}
      </ItemContainer>
    )
  }
}
