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
  UserName,
  CommentContent,
  NotificationContent,
  Timestamp,
} from './Modals/Shared'
import {Row} from './FlexboxGrid'

const Container = styled.div`
  padding: 25px;
`

const StyledUserName = styled(UserName)`
  font-size: 16px;
`

const StyledTimestamp = styled(Timestamp)`
  font-size: 12px;
  margin-top: -8px;
`

const InteractiveContainer = styled.div`
  &:hover ${Container} {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`
const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

const StyledImage = styled.img`
  width: 60px;
  height: 60px;
`

export default class NotificationRow extends Component {
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
      <VerticalCenter>
        <Row>
          <StyledUserName>{user.username}&nbsp;</StyledUserName>
          <NotificationContent>{this.props.notification}</NotificationContent>          
        </Row>
        {this.props.comment ? <CommentContent>{this.props.comment}</CommentContent> : null }
      </VerticalCenter>
    )
  }


  renderTimestamp = () => {
    return (
      <VerticalCenter>
        <StyledTimestamp margin='none' width='50px' >{moment(this.props.timestamp).fromNow()}</StyledTimestamp>
      </VerticalCenter>
    )
  }

  renderTripImage = () => {
    return (
      <StyledImage
        src={getImageUrl(this.props.trip.image)}
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
