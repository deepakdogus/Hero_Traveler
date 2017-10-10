import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getS3ImageUrl from '../Shared/Lib/getS3ImageUrl'
import Avatar from './Avatar'
import {getSize} from './Icon'
import HorizontalDivider from './HorizontalDivider'
import {
  UserNameStyles,
  CommentContent,
  NotificationContent,
  Timestamp,
} from './Modals/Shared'
import SpaceBetweenRow from './SpaceBetweenRow'
import metrics from '../Shared/Themes/Metrics'

let avatarWidth = getSize({size: 'larger'})
avatarWidth = Number(avatarWidth.substring(0, avatarWidth.length - 2))

const relevantMetrics  = {
  containerPadding: 25,
  imageWidth: 60,
  avatarWidth,
  leftPadding: 14,
}

const Container = styled.div`
  padding: ${relevantMetrics.containerPadding}px;
`

const StyledUserName = styled.span`
  ${UserNameStyles},
  font-size: 16px;
`

const StyledTimestamp = styled(Timestamp)`
  font-size: 12px;
  margin-top: 8px;
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
  width: ${relevantMetrics.imageWidth}px;
  height: ${relevantMetrics.imageWidth}px;
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: ${relevantMetrics.leftPadding}px;
`

const notificationContentWidth = metrics.rightModalWidth -
  (2 * relevantMetrics.containerPadding +
  relevantMetrics.avatarWidth +
  relevantMetrics.imageWidth +
  relevantMetrics.leftPadding + 1)

const StyledNotificationContent = styled(NotificationContent)`
  max-width: ${notificationContentWidth}px;
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
        avatarUrl={getImageUrl(this.props.user.profile.avatar, 'avatar')}
        size='larger'
      />
    )
  }

  renderText = () => {
    const {user} = this.props
    return (
      <StyledVerticalCenter>
        <StyledNotificationContent>
          <StyledUserName>{user.username}&nbsp;</StyledUserName>
          {this.props.notification}
        </StyledNotificationContent>
        {this.props.comment &&
          <CommentContent>
            {this.props.comment}
          </CommentContent>
        }
        <StyledTimestamp
          margin='none'
          width='50px' >
          {moment(this.props.timestamp).fromNow()}
        </StyledTimestamp>
      </StyledVerticalCenter>
    )
  }

  renderTripImage = () => {
    // temp fix until we get actual data
    this.props.trip.image.versions.thumbnail240.path = this.props.trip.image.versions.thumbnail240.path.split(" ").join("-")
    return (
      <VerticalCenter>
        <StyledImage
          src={getS3ImageUrl(this.props.trip.image, 'versions.thumbnail240.path')}
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <InteractiveContainer>
        <Container margin={this.props.margin}>
          <SpaceBetweenRow
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderRight={this.renderTripImage}
          />
        </Container>
        <StyledHorizontalDivider color='light-grey'/>
      </InteractiveContainer>
    )
  }
}
