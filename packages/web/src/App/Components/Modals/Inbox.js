import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import MessageRow from '../MessageRow'
import {RightTitle, RightModalCloseX} from './Shared'
import {randomDate} from './Shared/RandomDate'

const Container = styled.div``

const UserMessageRowsContainer = styled.div`
`

export default class Inbox extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderUserMessageRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <MessageRow
          key={key}
          user={usersExample[key]}
          message=''
          timestamp={randomDate(new Date(2017,7,1), new Date())}
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
        <RightTitle>INBOX</RightTitle>
        <UserMessageRowsContainer>
          {this.renderUserMessageRows(userKeys)}
        </UserMessageRowsContainer>
      </Container>
    )
  }
}
