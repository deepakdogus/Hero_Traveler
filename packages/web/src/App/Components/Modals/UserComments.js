import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import CommentRow from '../CommentRow'
import InputRow from '../InputRow'
import {RightTitle, RightModalCloseX} from './Shared'
import {randomDate} from './Shared/RandomDate'


const Container = styled.div``

const CommentContainer = styled(Container)`
  margin-top: 15px;
`

export default class UserComments extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderUserCommentRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <CommentRow
          key={key}
          index={index}
          user={usersExample[key]}
          comment=''
          timestamp={randomDate(new Date(2017,7,1), new Date())}
          padding='10px 30px'
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
        <RightTitle>COMMENTS</RightTitle>
        <CommentContainer>
          {this.renderUserCommentRows(userKeys)}
        </CommentContainer>
        <InputRow/>
      </Container>
    )
  }
}
