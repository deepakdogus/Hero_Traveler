import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import FollowFollowingRow from '../FollowFollowingRow'
import {RightTitle, RightModalCloseX} from './Shared'

const Container = styled.div``

const UserRowsContainer = styled.div`
  padding: 25px;
`

export default class LikedBy extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderUserRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <FollowFollowingRow
          key={key}
          user={usersExample[key]}
          isFollowing={index === 0}
          margin='0 0 25px'
        />
      )
    })
  }

  render() {
    const {profile} = this.props
    const userKeys = Object.keys(usersExample).filter((key, index) => {
      return key !== profile.id
    })

    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>LIKED BY</RightTitle>
        <UserRowsContainer>
          {this.renderUserRows(userKeys)}
        </UserRowsContainer>
      </Container>
    )
  }
}
