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
  display: flex;
  flex-direction: row;
  align-items: center;
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

const ActivityTypes = {
  like: 'ActivityStoryLike',
  follow: 'ActivityFollow',
  comment: 'ActivityStoryComment'
}

const videoThumbnailOptions = {
  video: true,
}

export default class NotificationRow extends Component {
  static propTypes = {
    user: PropTypes.object,
    activityKind: PropTypes.string,
    isFeedItem: PropTypes.bool,
    story: PropTypes.object,
    reroute: PropTypes.func,
    closeModal: PropTypes.func,
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
        <Avatar
          avatarUrl={getImageUrl(this.props.user.profile.avatar, 'avatar')}
          size='larger'
        />
      </RenderImageContainer>
    )
  }

  renderSeenBullet = () => {
    const BulletContainer = this.props.seen ? HiddenBulletContainer : VisibleBulletContainer
    return (<BulletContainer />)
  }

  renderText = () => {
    const {user} = this.props

    return (
      <StyledVerticalCenter>
        <StyledNotificationContent>
          <StyledUserName>{user.username}&nbsp;</StyledUserName>
          {this.getDescription()}
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
    const {
      story,
      isFeedItem,
    } = this.props

    if (isFeedItem) {
      let imageUrl
      if (story.coverImage) imageUrl = getImageUrl(story.coverImage, 'thumbnail')
      else imageUrl = getImageUrl(story.coverVideo, 'optimized', videoThumbnailOptions)

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
    if (!this.props.seen) {
      this.props.markSeen(this.props.activityId)
    }
  }

  getDescription = () => {
    const {story, activityKind} = this.props
    switch (activityKind) {
      case ActivityTypes.follow:
        return `is now following you.`
      case ActivityTypes.comment:
        return  `commented on your story ${story.title}.`
      case ActivityTypes.like:
        return `liked your story ${story.title}.`
      default:
        return ''
    }
  }


  render() {
    const leftProps = { 'max-width': '450px', }
    const {activityKind, story} = this.props
    if (activityKind !== ActivityTypes.follow && !story) return null
    return (
      <InteractiveContainer onClick={this._markSeen}>
        <Container
          onClick={this.props.isFeedItem? this.navToStory : this.navToUserProfile}
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
