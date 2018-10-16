import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'

import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {
  getContent,
  getDescription,
} from '../Shared/Lib/NotificationHelpers'
import Avatar from './Avatar'
import {getSize} from './Icon'
import HorizontalDivider from './HorizontalDivider'
import {
  UserNameStyles,
  Timestamp,
} from './Modals/Shared'
import SpaceBetweenRow from './SpaceBetweenRow'

let avatarWidth = getSize({size: 'larger'})
avatarWidth = Number(avatarWidth.substring(0, avatarWidth.length - 2))

const relevantMetrics = {
  containerPadding: 25,
  imageWidth: 60,
  avatarWidth,
  leftPadding: 14,
}

const Container = styled.div`
  padding: ${relevantMetrics.containerPadding}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
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

const StyledImageContainer = styled.div`
  width: ${relevantMetrics.imageWidth}px;
  height: ${relevantMetrics.imageWidth}px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const StyledImage = styled.img`
  height: 100%;
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: ${relevantMetrics.leftPadding}px;
`

const CommentContent = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  flex-wrap: wrap;
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

const StyledNotificationContent = styled(NotificationContent)`
  width: 300px;
`

const RenderImageContainer = styled.div`
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    flex-direction: row;
`
const VisibleBulletContainer = styled.div`
  display: flex;
  background-color: #ed1e2e;
  margin: 0;
  margin-right: 15px;
  padding: 0;
  width: 7.1px;
  height: 7.1px;
  border-radius: 50%;
`

const HiddenBulletContainer = styled(VisibleBulletContainer)`
  visibility: hidden;
`

const videoThumbnailOptions = {
  video: true,
  width: 100,
  height: 100,
}

export default class NotificationRow extends Component {
  static propTypes = {
    activity: PropTypes.object,
    isFeedItem: PropTypes.bool,
    reroute: PropTypes.func,
    closeModal: PropTypes.func,
    markSeen: PropTypes.func,
  }

  navToStory = () => {
    this.props.reroute(`/story/${this.props.activity.story.id}`)
    this.props.closeModal()
  }

  navToUserProfile = () => {
    this.props.reroute(`/profile/${this.props.activity.fromUser.id}/view`)
    this.props.closeModal()
  }

  renderImage = () => {
    const avatar = _.get(this, 'props.user.profile.avatar')
    return (
      <RenderImageContainer>
        <Avatar
          avatarUrl={avatar ? getImageUrl(avatar, 'avatarLarge') : undefined}
          size='larger'
        />
      </RenderImageContainer>
    )
  }

  renderSeenBullet = () => {
    if (this.props.activity.seen) return ( <HiddenBulletContainer /> )
    else return ( <VisibleBulletContainer /> )
  }

  renderText = () => {
    const { activity } = this.props

    return (
      <StyledVerticalCenter>
        <StyledNotificationContent>
          <StyledUserName>
            {activity.fromUser.username}&nbsp;
          </StyledUserName>
          {getDescription(activity)}
        </StyledNotificationContent>
        {!!activity.comment &&
          <CommentContent>
            {getContent(activity)}
          </CommentContent>
        }
        <StyledTimestamp
          margin='none'
          width='50px' >
          {moment(activity.createdAt).fromNow()}
        </StyledTimestamp>
      </StyledVerticalCenter>
    )
  }

  renderTripImage = () => {
    const {
      isFeedItem,
      activity,
    } = this.props
    if (isFeedItem) {
      const feedItem = activity.story || activity.guide
      let imageUrl
      if (feedItem.coverImage) imageUrl = getImageUrl(feedItem.coverImage, 'thumbnail')
      else imageUrl = getImageUrl(feedItem.coverVideo, 'optimized', videoThumbnailOptions)

      return (
        <VerticalCenter>
          <StyledImageContainer>
            <StyledImage
              src={imageUrl}
            />
          </StyledImageContainer>
        </VerticalCenter>
      )
    } else return
  }

  _markSeen = () => {
    if (!this.props.activity.seen) {
      this.props.markSeen(this.props.activity.id)
    }
  }

  render() {
    const leftProps = { 'max-width': '450px', }

    return (
      <InteractiveContainer onClick={this._markSeen}>
        <Container
          onClick={this.props.isFeedItem ? this.navToStory : this.navToUserProfile}
          >
          {this.renderSeenBullet()}
          <SpaceBetweenRow
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderRight={this.renderTripImage}
            leftProps={leftProps}
          />
        </Container>
        <StyledHorizontalDivider color='light-grey'/>
      </InteractiveContainer>
    )
  }
}
