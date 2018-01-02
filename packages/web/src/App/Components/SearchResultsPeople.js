import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'

import UserActions, {getFollowers} from '../Shared/Redux/Entities/Users'

import HorizontalDivider from './HorizontalDivider'
import FollowFollowingRow from './FollowFollowingRow'

const Container = styled.div`
  margin-top: 50px;
`

export class SearchResultsPeople extends Component {
  static PropTypes = {
    userSearchResults: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  userIsSelected(user) {
    return _.includes(this.props.selectedUsersById, user.id)
  }

  _followUser = (currentUser, userIdToFollow) => {
    this.props.followUser(currentUser, userIdToFollow)
  }

  _unfollowUser = (currentUser, userIdToUnfollow) => {
    this.props.unfollowUser(currentUser, userIdToUnfollow)
  }

  render() {
    const users = this.props.userSearchResults;

    /*
      We only need the first 4 elements for suggestions
      We will improve this check to allow 'pagination' will carousel scroll
    */
    const renderedUsers = Object.keys(users).reduce((rows, key, index) => {
      const user = users[key]
      if (index >= 4) return null
      const isSelected = this.userIsSelected(user)
      if (index !== 0) rows.push((<HorizontalDivider key={`${key}-HR`} color='light-grey'/>))
      rows.push((
        <FollowFollowingRow
          key={key}
          user={user}
          isFollowing={isSelected}
          onFollowClick={isSelected ? this._unfollowUser : this._followUser}
          type='follow'
          currentUser={this.props.currentUser}
        />
      ))
      return rows
    }, [])
    return (
      <Container>
        {renderedUsers}
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const users = state.entities.users.entities
  const currentUser = users[state.session.userId]
  return {
    currentUser,
    users,
    selectedUsersById: getFollowers(state.entities.users, 'following', currentUser.id),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    followUser: (sessionUserID, userIdToFollow) => dispatch(UserActions.followUser(sessionUserID, userIdToFollow)),
    unfollowUser: (sessionUserID, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserID, userIdToUnfollow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPeople)
