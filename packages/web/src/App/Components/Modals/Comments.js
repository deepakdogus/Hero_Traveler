import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import MessageRow from '../MessageRow'
import InputRow from '../InputRow'
import {RightTitle, RightModalCloseX} from './Shared'
import {randomDate} from './Shared/RandomDate'


const Container = styled.div``

export default class Comments extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderUserMessageRows(userKeys) {
    return userKeys.map((key, index) => {
      return (
        <MessageRow
          key={key}
          index={index}
          user={usersExample[key]}
          message=''
          timestamp={randomDate(new Date(2017,7,1), new Date())}
          padding='10px 30px'
          isComment={true}
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
        {this.renderUserMessageRows(userKeys)}
        <InputRow/>
      </Container>
    )
  }
}
