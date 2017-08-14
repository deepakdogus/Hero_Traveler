import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import SpaceBetweenRowWithTimeStamp from './SpaceBetweenRowWithTimeStamp'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import HorizontalDivider from './HorizontalDivider'
import {
  StyledVerticalCenter,
  UserName,
  MessageContent,
  Timestamp,
} from './Modals/Shared'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

export default class MessageRow extends Component {
  static propTypes = {
    message: PropTypes.string,
    user: PropTypes.object
  }

  renderImage = () => {
    return (
      <Avatar
        avatarUrl={getImageUrl(this.props.user.profile.avatar)}
        size='larger'
      />
    )
  }

  renderText = () => {
    const {user} = this.props
    const messageText = this.props.message ? this.props.message : 'Lorum Ipsum'
    return (
      <StyledVerticalCenter>
        <UserName>{user.username}</UserName>
        <MessageContent>{messageText}</MessageContent>
      </StyledVerticalCenter>
    )
  }


  renderTimestamp = () => {
    return (
      <VerticalCenter>
        <Timestamp margin='none' width='50px' >{moment(this.props.timestamp).fromNow()}</Timestamp>
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <SpaceBetweenRowWithTimeStamp
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderTimestamp={this.renderTimestamp}
        />
        <HorizontalDivider color='light-grey'/>
      </Container>
    )
  }
}
