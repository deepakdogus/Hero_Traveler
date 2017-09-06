import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import InboxThreadRow from '../InboxThreadRow'
import {RightTitle} from './Shared'
import {randomDate} from './Shared/RandomDate'
import InputRow from '../InputRow'
import TextButton from '../TextButton'

const Container = styled.div``

const InboxThreadRowsContainer = styled.div`
  padding: 25px;
`
export const StyledTextButton = styled(TextButton)`
  position: absolute;
  top: 17px;
  left: 4px;
  cursor: pointer;
`

export default class InboxThread extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderInboxThreadRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <InboxThreadRow
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
        <StyledTextButton 
          type='blackWhite'
          textAlign='left'
          margin='none'
          onClick={this.props.closeModal}
          text='< Inbox'
          />
        <RightTitle>{seedSender}</RightTitle>
        <InboxThreadRowsContainer>
          {this.renderInboxThreadRows(userKeys)}
        </InboxThreadRowsContainer>
        <InputRow/>
      </Container>
    )
  }
}
