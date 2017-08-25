import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import MessageThreadRow from '../MessageThreadRow'
import {RightTitle, RightModalCloseX} from './Shared'
import {randomDate} from './Shared/RandomDate'

const Container = styled.div``

const MessageThreadRowsContainer = styled.div`
  padding: 25px;
`

export default class UserComments extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderMessageThreadRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <MessageThreadRow
          key={key}
          user={usersExample[key]}
          message=''
          isSender={index % 2 ? false : true}
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

    const seedSender = usersExample[userKeys[0]].username

    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>{seedSender}</RightTitle>
        <MessageThreadRowsContainer>
          {this.renderMessageThreadRows(userKeys)}
        </MessageThreadRowsContainer>
      </Container>
    )
  }
}
