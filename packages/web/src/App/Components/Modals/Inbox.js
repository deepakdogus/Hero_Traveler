import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import momentRandom from 'moment-random'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import MessageRow from '../MessageRow'
import InputRow from '../InputRow'
import {RightTitle} from './Shared'

const Container = styled.div``

const UserMessageRowsContainer = styled.div`
  padding: 25px;
`

export default class Inbox extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
  }

  renderUserMessageRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <MessageRow
          key={key}
          user={usersExample[key]}
          message=''
          timestamp={new Date()}
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
        <RightTitle>INBOX</RightTitle>
        <UserMessageRowsContainer>
          {this.renderUserMessageRows(userKeys)}
        </UserMessageRowsContainer>
      </Container>
    )
  }
}
