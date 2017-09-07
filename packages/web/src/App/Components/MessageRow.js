import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import SpaceBetweenRowWithTimeStamp from './SpaceBetweenRowWithTimeStamp'
import VerticalCenter from './VerticalCenter'
import getS3ImageUrl from '../Shared/Lib/getS3ImageUrl'
import Avatar from './Avatar'
import HorizontalDivider from './HorizontalDivider'
import {
  UserName,
  MessageContent,
  Timestamp,
} from './Modals/Shared'

const Container = styled.div`
`

const MessageContainer = styled(Container)`
  padding: 20px 30px;
`

const TimestampContainer = styled(VerticalCenter)`
  justify-content: flex-start;
  margin-top: 10px;
`

const TextContainer = styled(VerticalCenter)`
  justify-content: flex-start;
  margin-left: 20px;
  margin-top: 10px;
`

const InteractiveContainer = styled.div`
  &:hover ${Container} {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

export default class MessageRow extends Component {
  static propTypes = {
    message: PropTypes.string,
    user: PropTypes.object,
    timestamp: PropTypes.object,
    isComment: PropTypes.bool,
  }

  renderImage = () => {
    return (
      <Avatar
        avatarUrl={getS3ImageUrl(this.props.user.profile.avatar)}
        size='larger'
      />
    )
  }

  renderText = () => {
    const {user} = this.props
    const messageText = this.props.message ? this.props.message : 'Lorum Ipsum'
    return (
      <TextContainer>
        <UserName>{user.username}</UserName>
        <MessageContent>{messageText}</MessageContent>
      </TextContainer>
    )
  }


  renderTimestamp = () => {
    return (
      <TimestampContainer>
        <Timestamp>{moment(this.props.timestamp).fromNow()}</Timestamp>
      </TimestampContainer>
    )
  }

  renderNormalContainer = () => {
    return(
      <Container>
        {this.props.index > 0 ? <StyledHorizontalDivider color='light-grey'/> : null}
          <MessageContainer>
            <SpaceBetweenRowWithTimeStamp
              renderImage={this.renderImage}
              renderText={this.renderText}
              renderTimestamp={this.renderTimestamp}
            />
          </MessageContainer>        
        {!this.props.isComment ? <StyledHorizontalDivider color='light-grey'/> : null}
      </Container>
      )
  }

  renderInteractiveContainer = () => {
    return(
      <InteractiveContainer>
        {this.props.index > 0 ? <StyledHorizontalDivider color='light-grey'/> : null}
          <MessageContainer>
            <SpaceBetweenRowWithTimeStamp
              renderImage={this.renderImage}
              renderText={this.renderText}
              renderTimestamp={this.renderTimestamp}
            />
          </MessageContainer>        
        {!this.props.isComment ? <StyledHorizontalDivider color='light-grey'/> : null}
      </InteractiveContainer>
      )
  }

  render() {
    return (
      <div>
        {!this.props.isComment ? this.renderInteractiveContainer () : this.renderNormalContainer()}  
      </div>        
    )
  }
}
