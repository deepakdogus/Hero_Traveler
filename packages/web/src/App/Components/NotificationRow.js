import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import {getSize} from './Icon'
import HorizontalDivider from './HorizontalDivider'
import {
  UserNameStyles,
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

const CommentContent = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

const NotificationContent = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.background};
`

const notificationContentWidth = metrics.rightModalWidth -
  (2 * relevantMetrics.containerPadding +
  relevantMetrics.avatarWidth +
  relevantMetrics.imageWidth +
  relevantMetrics.leftPadding + 1)

const StyledNotificationContent = styled(NotificationContent)`
  max-width: ${notificationContentWidth}px;
`

const RenderImageContainer = styled.div`
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    flex-direction: row;
`

const NewNotificationBullet = styled.div`
  display: flex;
  background-color: #ed1e2e;
  margin: 0;
  margin-right: 5px;
  padding: 0;
  width: 7.1px;
  height: 7.1px;
  border-radius: 50%;
`

export default class NotificationRow extends Component {
  static propTypes = {
    notification: PropTypes.string,
    closeModal: PropTypes.func,
    comment: PropTypes.string,
    user: PropTypes.object,
    trip: PropTypes.object,
    story: PropTypes.object,
    isFeedItem: PropTypes.bool,
    timestamp: PropTypes.object,
    reroute: PropTypes.func,
    seen: PropTypes.bool,
    markSeen: PropTypes.func,
    activityId: PropTypes.string,
  }

  navToStory = () => {
    this.props.reroute(`/story/${this.props.story.id}`)
    this.props.closeModal()
  }

  navToUserProfile = () => {
    this.props.reroute(`/profile/${this.props.user.id}/view`)
    this.props.closeModal()
  }

  renderImage = () => {
    return (
      <RenderImageContainer>
        {!this.props.seen && <NewNotificationBullet />}
        <Avatar
          avatarUrl={getImageUrl(this.props.user.profile.avatar, 'avatar')}
          size='larger'
        />
      </RenderImageContainer>
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
    if(this.props.isFeedItem){
      return (
        <VerticalCenter>
          <StyledImage
            src={getImageUrl(this.props.story.coverImage, 'thumbnail')}
          />
        </VerticalCenter>
      )
    } else return
  }

  _markSeen = () => {
    if (!this.props.seen) {
      this.props.markSeen(this.props.activityId)
    }
  }

  render() {
    return (
      <InteractiveContainer onClick={this._markSeen}>
        <Container
          onClick={this.props.isFeedItem? this.navToStory : this.navToUserProfile}
          >
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
