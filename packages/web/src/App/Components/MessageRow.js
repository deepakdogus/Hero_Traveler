import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from '../Shared/Web/Components/Avatar'
import HorizontalDivider from './HorizontalDivider'
import {
  UserName,
  MessageContent,
  Timestamp,
} from './Modals/Shared'

const MessageContainer = styled.div`
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
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    justify-content: center;
    margin-top: 0;
    height: 100%;
  }
`

const InteractiveContainer = styled.div`
  &:hover {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

const responsiveAvatarStyles = `
  width: 50px;
  height: 50px;
`

export default class MessageRow extends Component {
  static propTypes = {
    reroute: PropTypes.func,
    closeModal: PropTypes.func,
    message: PropTypes.string,
    user: PropTypes.object,
    timestamp: PropTypes.object,
    isComment: PropTypes.bool,
  }

  _profileReroute = () => {
    this.props.reroute(`/${this.props.user.username}`)
    this.props.closeModal()
  }

  renderImage = () => {
    return (
      <Avatar
        avatarUrl={getImageUrl(this.props.user.profile.avatar, 'avatarLarge')}
        size='larger'
        type='profile'
        onClick={this._profileReroute}
        responsiveProps={responsiveAvatarStyles}
      />
    )
  }

  renderText = () => {
    const {user} = this.props
    const messageText = this.props.message ? this.props.message : 'Lorum Ipsum'
    return (
      <TextContainer>
        <UserName
          onClick={this._profileReroute}
        >
          {user.username}
        </UserName>
        <MessageContent>{messageText}</MessageContent>
      </TextContainer>
    )
  }

  renderRight = () => {
    return (
      <TimestampContainer>
        <Timestamp>{moment(this.props.timestamp).fromNow()}</Timestamp>
      </TimestampContainer>
    )
  }

  render() {
    return (
      <InteractiveContainer>
        {this.props.index > 0 ? <StyledHorizontalDivider color='light-grey'/> : null}
          <MessageContainer>
            <SpaceBetweenRow
              renderImage={this.renderImage}
              renderText={this.renderText}
              renderRight={this.renderRight}
              leftProps={{ 'max-width': `75%`, 'flex-wrap': `nowrap` }}
            />
          </MessageContainer>
        {!this.props.isComment ? <StyledHorizontalDivider color='light-grey'/> : null}
      </InteractiveContainer>
    )
  }
}
