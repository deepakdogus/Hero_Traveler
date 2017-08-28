import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import SpaceBetweenRowWithTripImage from './SpaceBetweenRowWithTripImage'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import HorizontalDivider from './HorizontalDivider'
import {
  StyledVerticalCenter,
  UserName,
  CommentContent,
  NotificationContent,
  Timestamp,
} from './Modals/Shared'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
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
    notification: PropTypes.string,
    comment: PropTypes.string,
    user: PropTypes.object,
    trip: PropTypes.object,
    isTrip: PropTypes.bool,
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
    const {user} = this.props
    return (
      <StyledVerticalCenter>
        <UserName>{user.username}</UserName>
        <NotificationContent>{this.props.notification}</NotificationContent>
        <CommentContent>{this.props.comment}</CommentContent>
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

  renderTripImage = () => {
    return (
      <Avatar
        avatarUrl={getImageUrl(this.props.trip.image)}
        size='large'
        square={true}
      />
    )
  }

  render() {
    return (
      <InteractiveContainer>
        <Container margin={this.props.margin}>
          <SpaceBetweenRowWithTripImage
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderTimestamp={this.renderTimestamp}
            renderTripImage={this.renderTripImage}
          />
        </Container>
        <StyledHorizontalDivider color='light-grey'/>        
      </InteractiveContainer>
    )
  }
}
