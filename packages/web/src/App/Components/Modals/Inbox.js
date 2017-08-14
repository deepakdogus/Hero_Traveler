import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import momentRandom from 'moment-random'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import CommentRow from '../CommentRow'
import InputRow from '../InputRow'
import {RightTitle} from './Shared'

const Container = styled.div``

const UserCommentRowsContainer = styled.div`
  padding: 25px;
`

export default class UserComments extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
  }

  renderUserCommentRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <CommentRow
          key={key}
          user={usersExample[key]}
          comment=''
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
        <RightTitle>COMMENTS</RightTitle>
        <UserCommentRowsContainer>
          {this.renderUserCommentRows(userKeys)}
        </UserCommentRowsContainer>
        <InputRow/>
      </Container>
    )
  }
}
