import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import FollowFollowingRow from '../FollowFollowingRow'

const Title = styled.p`
  font-weight: 400;
  font-size: 20px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  text-align: center;
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  margin: 0;
  padding: 20px;
`

const Container = styled.div``

const UserRowsContainer = styled.div`
  padding: 25px;
`

export default class FollowFollowing extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
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
        <Title>{profile.username.toUpperCase()} IS FOLLOWED BY</Title>
        <UserRowsContainer>
          {this.renderUserRows(userKeys)}
        </UserRowsContainer>
      </Container>
    )
  }
}
