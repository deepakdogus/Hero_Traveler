import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import SendToRow from '../SendToRow'
import {RightTitle, StyledInput, RightModalCloseX} from './Shared'

const Container = styled.div``

const UserRowsContainer = styled.div`
  padding: 25px;
`
const InputContainer = styled.div`
  padding: 25px;
`

export default class SendTo extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderUserRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <SendToRow
          key={key}
          user={usersExample[key]}
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
        <RightTitle>SEND TO</RightTitle>
        <InputContainer>
          <StyledInput placeholder='Search by name or email'/>
        </InputContainer>
        <UserRowsContainer>
          {this.renderUserRows(userKeys)}
        </UserRowsContainer>

      </Container>
    )
  }
}
