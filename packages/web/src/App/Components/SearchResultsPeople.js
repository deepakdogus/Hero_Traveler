import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import HorizontalDivider from './HorizontalDivider'
import FollowFollowingRow from './FollowFollowingRow'

const Container = styled.div`
  margin-top: 50px;
`

export default class SearchResultsPeople extends Component {
  static PropTypes = {
    userSearchResults: PropTypes.object,
    userFollowing: PropTypes.array,
    currentUser: PropTypes.string

  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    //const stories = this.props.storySearchResults.hits ? this.props.storySearchResults.hits : [];
    const users = this.props.userSearchResults.hits ? this.props.userSearchResults.hits : [];
    const {userFollowing, currentUser} = this.props

    /*
      We only need the first 4 elements for suggestions
      We will improve this check to allow 'pagination' will carousel scroll
    */
    // const renderedUsers = Object.keys(users).reduce((rows, key, index) => {
    //   const user = users[key]
    //   if (index >= 4) return null
    //   const isSelected = index % 2 === 0
    //   if (index !== 0) rows.push((<HorizontalDivider key={`${key}-HR`} color='light-grey'/>))
    //   rows.push((
    //     <FollowFollowingRow
    //       key={key}
    //       user={user}
    //       isFollowing={isSelected}
    //       type='follow'
    //     />
    //   ))
    //   return rows
    // }, [])

    const renderedUsers = users.map((user, index)=> {
      const isFollowing = userFollowing[currentUser].byId.includes(user.objectID)
      return (
        <FollowFollowingRow
          key={index}
          user={user}
          type='follow'
          isFollowing={isFollowing}
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

