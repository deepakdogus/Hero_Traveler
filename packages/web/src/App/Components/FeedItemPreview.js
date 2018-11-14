import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  isStoryLiked,
  isGuideLiked,
  isStoryBookmarked,
} from '../Shared/Redux/Entities/Users'
import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'
import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import UXActions from '../Redux/UXRedux'
import { displayLocationPreview } from '../Shared/Lib/locationHelpers'
import { runIfAuthed } from '../Lib/authHelpers'

import Avatar from './Avatar'
import LikeComponent from './LikeComponent'
import { Row } from './FlexboxGrid'
import VerticalCenter from './VerticalCenter'
import Icon from './Icon'

import OverlayHover from './OverlayHover'

import {
  roleToIconName,
  hasBadge,
} from '../Shared/Lib/badgeHelpers'

const coverHeight = '257px'

const Text = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .2px;
  font-size: 15px;
  color: ${props => props.theme.Colors.grey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const HorizontalMarginWrapper = styled.div`
  position: relative;
  max-width: 960px;
  margin: auto;
  color: ${props => props.theme.Colors.lightGrey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-bottom: 15px;
  }
`

const VerticalMarginWrapper = styled(HorizontalMarginWrapper)`
  margin: 25px 0 0;
  flex-basis: 385.5px;
  &:nth-child(2) {
    padding-left: 20px;
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    max-width: 100%;
    margin: 0;
    width: 100%;
  }
`

const HorizontalRowWrapper = styled(Row)`
  flex-wrap: nowrap;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    flex-direction: column;
    justify-content: center;
  }
`

const VerticalWrapper = styled.div`
  margin: 0;
`

const HorizontalStoryInfoContainer = styled(VerticalCenter)`
  position: relative;
  height: ${coverHeight};
  flex-basis: 385.5px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height:auto;
    width: auto;
    flex-basis: unset;
    > * {
      padding-left: ${props => props.type === 'guide' ? '0' : '15px'};
      padding-right: ${props => props.type === 'guide' ? '0' : '15px'};
      padding-top: 15px;
    }
  }
`

const VerticalStoryInfoContainer = styled(HorizontalStoryInfoContainer)`
  height: auto;
  margin-left: 0;
  > * {
    padding: 5px 0px
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 5px;
    > * {
      padding-left: ${props => props.type === 'guide' ? '0' : '15px'};
      padding-right: ${props => props.type === 'guide' ? '0' : '15px'};
      padding-top: 0px;
    }
  }
`

const HorizontalDetailsContainer = styled(Row)`
  padding-top: 13px;
  position: relative;
`

const VerticalDetailsContainer = styled(HorizontalDetailsContainer)`
  padding-top: 0px;
`

const HorizontalLocationPreview = styled(Text)`
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 6px;
  margin-bottom: 12px;
  text-transform: uppercase;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 13px;
    margin: 0;
  }
`

const VerticalLocationPreview = styled(HorizontalLocationPreview)`
  margin-top: 0px;
  margin-bottom: 0px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-bottom: 0px;
    font-size: 13px;
  }
`

const Title = styled.h3`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: ${props => props.isGuide ? '20px' : '25px'};
  color: ${props => props.theme.Colors.background};
  display: inline-block;
  margin: 0;
  cursor: pointer;
  padding: 12px 0;
  letter-spacing: .6px;
  word-break: break-word;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: ${props => props.type === 'guide' ? '0' : '0 15px'};
    font-size: ${props => props.type === 'guide' ? '15px' : '20px'};
    hyphens: auto;
  }
  &:hover {
    color: ${props => props.theme.Colors.grey};
  };
`

const ImageWrapper = styled.div`
  position: relative;
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

// 70.84 is for to maintain aspect ratio
const VerticalImageContainer = styled(ImageWrapper)`
  width: auto;
  height: 0;
  padding-bottom: 70.84%;
  background: center url(${props => props.src});
  background-size: cover;
`

const HorizontalImageContainer = styled(ImageWrapper)`
  margin-right: 20px;
  width: 385.5px;
  height: 257px;
  background: center url(${props => props.src});
  background-size: cover;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
    max-width:100vw;
    width: 100%;
  }
`

const StyledOverlay = styled(OverlayHover)`
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  &:hover div {
    visibility: visible;
  }
`

const CloseXContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
  visibility: hidden;
`

const GuideIconText = styled(HorizontalLocationPreview)`
  padding-left: 10px;
`

const Username = styled(Text)`
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
  font-size: 14px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const TimeStamp = styled(Text)`
  font-size: 14px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const Top = styled(Row)`
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    position: relative;
  }
`

const Bottom = styled(Row)`
  position: absolute;
  bottom: 0;
  left: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    position: relative;
  }
`

const BadgeIcon = styled(Icon)`
  margin-right: 6px;
`

const GuideIcon = styled(Icon)`
  padding-top: 7px;
  width: 17px;
  height: 17px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-top: 0;
  }
`

const BookmarkIcon = styled(Icon)`
  margin: 0 5px;
  cursor: pointer
`

const DeleteIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  align-self: center;
  cursor: pointer;
`

const videoThumbnailOptions = {
  video: true,
  width: 385.5,
}

class FeedItemPreview extends Component {
  static propTypes = {
    feedItem: PropTypes.object,
    author: PropTypes.object,
    guideId: PropTypes.string,
    sessionUserId: PropTypes.string,
    isGuideRow: PropTypes.bool,
    isStory: PropTypes.bool,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    reroute: PropTypes.func,
    onClickBookmark: PropTypes.func,
    onClickStoryLike: PropTypes.func,
    onClickGuideLike: PropTypes.func,
    onClickGuideUnLike: PropTypes.func,
    openGlobalModal: PropTypes.func,
    isVertical: PropTypes.bool,
  }

  defaultProps = {
    isStory: true,
  }

  navToFeedItem = () => {
    const storyOrGuide = this.props.isStory ? 'story' : 'guide'
    this.props.reroute(`/${storyOrGuide}/${this.props.feedItem.id}`)
  }

  navToUserProfile = () => {
    this.props.reroute(`/profile/${this.props.author.id}/view`)
  }

  _onClickLike = () => {
    const {
      sessionUserId, isLiked, isStory,
      onClickStoryLike, onClickGuideLike, onClickGuideUnLike,
    } = this.props

    if (isStory) onClickStoryLike(sessionUserId)
    else {
      if (isLiked) onClickGuideUnLike(sessionUserId)
      else onClickGuideLike(sessionUserId)
    }
  }

  _onClickBookmark = () => {
    const {sessionUserId, onClickBookmark} = this.props
    onClickBookmark(sessionUserId)
  }

  getLocationText = () => {
    const {locationInfo, locations = []} = this.props.feedItem
    if (locationInfo) return displayLocationPreview(locationInfo)
    else if (locations.length) return displayLocationPreview(locations[0])
  }

  openRemoveStoryModal = (event) => {
    event.stopPropagation()
    const {
      feedItem,
      guideId,
    } = this.props
    this.props.openGlobalModal(
      'guideStoryRemove',
      {
        guideId: guideId,
        storyId: feedItem.id,
      },
    )
  }

  noop = () => undefined

  render() {
    const {
      guideId,
      feedItem,
      author,
      isGuideRow,
      isLiked,
      isBookmarked,
      isStory,
      isVertical,
    } = this.props

    if (!feedItem || !author) return

    let imageUrl
    if (feedItem.coverImage) imageUrl = getImageUrl(feedItem.coverImage)
    else if (feedItem.coverVideo) {
      imageUrl = getImageUrl(feedItem.coverVideo, 'optimized', videoThumbnailOptions)
    }

    const MarginWrapper = isVertical ? VerticalMarginWrapper : HorizontalMarginWrapper
    const DirectionalWrapper = isVertical ? VerticalWrapper : HorizontalRowWrapper
    const ImageContainer = isVertical ? VerticalImageContainer : HorizontalImageContainer
    const StoryInfoContainer = isVertical ? VerticalStoryInfoContainer : HorizontalStoryInfoContainer
    const DetailsContainer = isVertical ? VerticalDetailsContainer : HorizontalDetailsContainer
    const LocationPreview = isVertical ? VerticalLocationPreview : HorizontalLocationPreview

    return (
      <MarginWrapper>
        <DirectionalWrapper>
          <ImageContainer
            onClick={guideId ? this.noop : this.navToFeedItem}
            src={imageUrl}
          >
            <StyledOverlay
              overlayColor='black'
              onClick={this.navToFeedItem}
            >
              {!!guideId &&
                <CloseXContainer onClick={this.openRemoveStoryModal}>
                  <DeleteIcon size='small' name='closeBlack'/>
                </CloseXContainer>
              }
            </StyledOverlay>
          </ImageContainer>
          <StoryInfoContainer isGuideRow={isGuideRow}>
            {!isStory &&
              <Top>
                <GuideIcon name='guide' />
                <GuideIconText>Guide</GuideIconText>
              </Top>
            }
            {!guideId &&
              <LocationPreview>{this.getLocationText()}</LocationPreview>
            }
            <Title
              onClick={this.navToFeedItem}
              isGuide={!!guideId}
              isGuideRow={isGuideRow}
            >
              {feedItem.title}
            </Title>
            <DetailsContainer between='xs'>
              <Row middle='xs'>
                {!isVertical &&
                  <Avatar
                    isStoryPreview
                    avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
                    size='avatar'
                    type='profile'
                    onClick={this.navToUserProfile}
                  />
                }
                {hasBadge(author.role) &&
                  <BadgeIcon
                    name={roleToIconName[author.role]}
                    size='small'
                    profileAvatar={author.profile.avatar}
                  />
                }
                <Username onClick={this.navToUserProfile}>{author.username}</Username>
                {!isVertical && <TimeStamp>, {moment(feedItem.createdAt).fromNow()}</TimeStamp>}
              </Row>
            </DetailsContainer>
            {!isVertical &&
              <Bottom>
                <LikeComponent
                  likes={formatCount(feedItem.counts.likes)}
                  isLiked={isLiked}
                  onClick={this._onClickLike}
                  horizontal
                />
                {isStory &&
                  <BookmarkIcon
                    name={isBookmarked ? 'feedBookmarkActive' : 'feedBookmark'}
                    onClick={this._onClickBookmark}
                  />
                }
              </Bottom>
            }
          </StoryInfoContainer>
        </DirectionalWrapper>
      </MarginWrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {session, entities} = state
  const sessionUserId = session.userId
  const {feedItem, isStory} = ownProps

  let feedItemProps = null
  if (feedItem) {
    feedItemProps = {
      author: entities.users.entities[feedItem.author],
      isBookmarked: isStoryBookmarked(entities.users, sessionUserId, feedItem.id),
    }
    feedItemProps.isLiked = isStory ?
    isStoryLiked(entities.users, sessionUserId, feedItem.id)
    : isGuideLiked(entities.users, sessionUserId, feedItem.id)
  }

  return {
    sessionUserId: state.session.userId,
    ...feedItemProps,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const {feedItem} = props

  return {
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
    onClickStoryLike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.storyLike, [sessionUserId, feedItem.id])),
    onClickGuideLike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, GuideActions.likeGuideRequest, [feedItem.id, sessionUserId])),
    onClickGuideUnLike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, GuideActions.unlikeGuideRequest, [feedItem.id, sessionUserId])),
    onClickBookmark: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.storyBookmark, [sessionUserId, feedItem.id])),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedItemPreview)
