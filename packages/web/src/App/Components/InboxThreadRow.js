import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import SpaceBetweenRowWithAvatar from './SpaceBetweenRowWithAvatar'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import {
  StyledVerticalCenter,
  MessageContent,
  Timestamp,
} from './Modals/Shared'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

export default class InboxThreadRow extends Component {
  static propTypes = {
    message: PropTypes.string,
    user: PropTypes.object,
    isSender: PropTypes.bool,
    timestamp: PropTypes.object,
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
    const messageText = this.props.message ? this.props.message : 'Lorum Ipsum'
    return (
      <StyledVerticalCenter>
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
        <SpaceBetweenRowWithAvatar
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderTimestamp={this.renderTimestamp}
          isSender={this.props.isSender}
        />
      </Container>
    )
  }
}
