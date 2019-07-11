import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {
  getContent,
  getDescriptionText,
  getFeedItemTitle,
  getFeedItemImageUrl,
  getAvatar,
  getUsername,
} from '../Shared/Lib/NotificationHelpers'
import Avatar from '../Shared/Web/Components/Avatar'
import { getSize } from '../Shared/Web/Components/Icon'
import HorizontalDivider from './HorizontalDivider'
import { UserNameStyles, Timestamp } from './Modals/Shared'
import SpaceBetweenRow from './SpaceBetweenRow'

let avatarWidth = getSize({ size: 'larger' })
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
`

const rowProps = {
  'justify-content': 'space-between',
}

const leftProps = {
  'max-width': '450px',
  'align-items': 'center',
  'flex-wrap': 'nowrap',
  'tablet-max-width': '85%',
}

const StyledUserName = styled.span`
  ${UserNameStyles}
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

const StyledTitle = styled(StyledUserName)``

const StyledTimestamp = styled(Timestamp)`
  font-size: 12px;
  margin-top: 8px;
`

const InteractiveContainer = styled.div`
  ${Container}
  cursor: default;
  &:hover {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`
const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

const StyledImageContainer = styled.div`
  width: ${relevantMetrics.imageWidth}px;
  height: ${relevantMetrics.imageWidth}px;
  margin-right: 22px; /* 15px + 7px notification dot width */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
`

const StyledImage = styled.img`
  height: 100%;
`

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
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
  letter-spacing: 0.2px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

const NotificationContent = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.2px;
  margin: 0;
  color: ${props => props.theme.Colors.background};
`

const StyledNotificationContent = styled(NotificationContent)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-right: 5px;
    word-break: break-word;
  }
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

const AvatarResponsiveStyle = `
  width: 50px;
  height: 50px;
`

const videoThumbnailOptions = {
  video: true,
  width: 100,
  height: 100,
}

export default class NotificationRow extends Component {
  static propTypes = {
    activity: PropTypes.object,
    reroute: PropTypes.func,
    closeModal: PropTypes.func,
    markSeen: PropTypes.func,
  }

  navToFeedItem = event => {
    event.stopPropagation()
    this._markSeen()
    const feedItem = this.props.activity.story || this.props.activity.guide
    const feedItemType = this.props.activity.story ? 'story' : 'guide'
    this.props.reroute(`/${feedItemType}/${feedItem.id}`)
    this.props.closeModal()
  }

  navToUserProfile = event => {
    event.stopPropagation()
    this._markSeen()
    this.props.reroute(`/${this.props.activity.fromUser.username}/view`)
    this.props.closeModal()
  }

  renderImage = () => {
    const avatar = getAvatar(this.props.activity)

    return (
      <RenderImageContainer>
        <StyledAvatar
          onClick={this.navToUserProfile}
          avatarUrl={avatar ? getImageUrl(avatar, 'avatarLarge') : undefined}
          type="profile"
          size="larger"
          responsiveProps={AvatarResponsiveStyle}
        />
      </RenderImageContainer>
    )
  }

  renderSeenBullet = () => {
    if (this.props.activity.seen) return <HiddenBulletContainer />
    else return <VisibleBulletContainer />
  }

  renderText = () => {
    const { activity } = this.props
    const title = getFeedItemTitle(activity)
    return (
      <StyledVerticalCenter>
        <StyledNotificationContent>
          <StyledUserName onClick={this.navToUserProfile}>
            {getUsername(activity)}&nbsp;
          </StyledUserName>
          {getDescriptionText(activity)}
          {!!title && (
            <StyledTitle onClick={this.navToFeedItem}>
              {title}
            </StyledTitle>
          )}
          .
        </StyledNotificationContent>
        {!!activity.comment && (
          <CommentContent>
            {getContent(activity)}
          </CommentContent>
        )}
        <StyledTimestamp
          margin="none"
          width="50px"
        >
          {moment(activity.createdAt).fromNow()}
        </StyledTimestamp>
      </StyledVerticalCenter>
    )
  }

  renderTripImage = () => {
    const { activity } = this.props
    const imageUrl = getFeedItemImageUrl(activity, videoThumbnailOptions)
    if (!imageUrl) return null
    return (
      <StyledVerticalCenter>
        <StyledImageContainer onClick={this.navToFeedItem}>
          <StyledImage src={imageUrl} />
        </StyledImageContainer>
      </StyledVerticalCenter>
    )
  }

  _markSeen = () => {
    if (!this.props.activity.seen) {
      this.props.markSeen(this.props.activity.id)
    }
  }

  render() {
    return (
      <InteractiveContainer onClick={this._markSeen}>
        <Container>
          {this.renderSeenBullet()}
          <SpaceBetweenRow
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderRight={this.renderTripImage}
            leftProps={leftProps}
            rowProps={rowProps}
          />
        </Container>
        <StyledHorizontalDivider color="light-grey" />
      </InteractiveContainer>
    )
  }
}
