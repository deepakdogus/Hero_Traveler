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

import Avatar from './Avatar'
import LikeComponent from './LikeComponent'
import { Row } from './FlexboxGrid'
import VerticalCenter from './VerticalCenter'
import Icon from './Icon'
import { sizes } from '../Themes/Metrics'

import OverlayHover from './OverlayHover'
import CloseX from './CloseX'

const coverHeight = '257px'

const Text = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  font-size: 15px;
  color: ${props => props.theme.Colors.grey};
  @media (max-width: ${sizes.tablet}px){
    font-size: 12px;
  }
`

const HorizontalMarginWrapper = styled.div`
  // border: 3px solid purple;
  position: relative;
  max-width: 960px;
  margin: auto;
  color: ${props => props.theme.Colors.lightGrey};
  @media (max-width: ${sizes.tablet}px){
    max-width: 100vw;
    width: 100vw;
    margin: 0;
  }
`

const VerticalMarginWrapper = styled(HorizontalMarginWrapper)`
  border: 3px solid teal;
  margin: 25px 0 0;
  @media (max-width: ${sizes.tablet}px){
    max-width: 100%;
    margin: 0;
    width:100%;
  }
`

const HorizontalRowWrapper = styled(Row)`
  border: 2px solid green;
  @media (max-width: ${sizes.tablet}px){
    width: 100vw;
    flex-direction: column;
    justify-content: center;
  }
`

const VerticalWrapper = styled.div`
  // border: 2px solid orange;
  // margin: 20px;
  @media (max-width: ${sizes.tablet}px){
    // width: 100%;
    // display: flex;
    // flex-direction: row;
    // justify-content: center;
    // margin: 20px;

  }
`

const HorizontalStoryInfoContainer = styled(VerticalCenter)`
  border: 2px solid red;
  position: relative;
  height: ${coverHeight};
  @media (max-width: ${sizes.tablet}px){
    height:auto;
    > * {
      padding-left: 15px;
      padding-top: 15px;
    }
  }
`

const VerticalStoryInfoContainer = styled(HorizontalStoryInfoContainer)`
  height: auto;
  margin-left: 0;
`

const HorizontalDetailsContainer = styled(Row)`
  padding-top: 13px;
  display: flex;
  position: relative;
`

const VerticalDetailsContainer = styled(HorizontalDetailsContainer)`
  padding-top: 5px;
`

const HorizontalLocationPreview = styled(Text)`
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  @media (max-width: ${sizes.tablet}px){
    font-size: 13px;
    margin: 0;
  }
`

const VerticalLocationPreview = styled(HorizontalLocationPreview)`
  margin-bottom: 6px;
`

const Title = styled.h3`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 23px;
  color: ${props => props.theme.Colors.background};
  display: inline-block;
  margin: 0;
  cursor: pointer;
  max-width: 225px;
  @media (max-width: ${sizes.tablet}px){
    max-width: 385.5px;
    font-size: 20px;
  }
  &:hover {
    color: ${props => props.theme.Colors.grey};
  };
`

const Description = styled.h2`
  font-size: 16px;
  letter-spacing: .7px;
  color : ${props => props.theme.Colors.grey};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  margin-top: 7.5px;
  margin-bottom: 0;
  @media (max-width: ${sizes.tablet}px){
    display: none;
  }
`

const ImageContainer = styled.div`
  // border: 3px solid red;
  position: relative;
  width: 385.5px;
  height: ${coverHeight};
  cursor: pointer;
  margin-right: 20px;
  @media (max-width: ${sizes.tablet}px){
    max-width:100vw;
    width: 100%;
    margin: 0;
    margin-right: 0px;
  }
`

const CoverImage = styled.img`
  // border: 2px solid yellow;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const ByText = styled(Text)`
  margin-left: 7.5px;
`

const Username = styled(Text)`
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
`

const Top = styled(Row)`
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: ${sizes.tablet}px){
    position: relative;
  }
`

const Bottom = styled(Row)`
  position: absolute;
  bottom: 0;
  left: 0;
  @media (max-width: ${sizes.tablet}px){
    position: relative;
  }
`

const BadgeIcon = styled(Icon)`
  margin-left: ${props => props.profileAvatar ? '0' : '6'}px;
`

const GuideIcon = styled(Icon)`
  width: 17px;
  height: 17px;
`

const BookmarkIcon = styled(Icon)`
  width: 12px;
  height: 16px;
  margin: 1.5px 10px;
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
      }
    )
  }

  noop = () => undefined

  render() {
    const {
      guideId,
      feedItem,
      author,
      sessionUserId,
      isLiked,
      isBookmarked,
      isStory,
      isVertical,
    } = this.props

    if (!feedItem || !author) return

    const hasBadge = author.role === 'contributor' || author.role === 'founding member'

    let imageUrl;
    if (feedItem.coverImage) imageUrl = getImageUrl(feedItem.coverImage)
    else if (feedItem.coverVideo) {
      imageUrl = getImageUrl(feedItem.coverVideo, 'optimized', videoThumbnailOptions)
    }

    const MarginWrapper = isVertical ? VerticalMarginWrapper : HorizontalMarginWrapper
    const DirectionalWrapper = isVertical ? VerticalWrapper : HorizontalRowWrapper
    const StoryInfoContainer = isVertical ? VerticalStoryInfoContainer : HorizontalStoryInfoContainer
    const DetailsContainer = isVertical ? VerticalDetailsContainer : HorizontalDetailsContainer
    const LocationPreview = isVertical ? VerticalLocationPreview : HorizontalLocationPreview

    return (
      <MarginWrapper>
        <DirectionalWrapper>
          <ImageContainer>
            <CoverImage
              src={imageUrl}
              onClick={guideId ? this.noop : this.navToFeedItem}
            />
            {!!guideId &&
              <StyledOverlay
                overlayColor='black'
                onClick={this.navToFeedItem}
              >
                <CloseXContainer>
                  <CloseX onClick={this.openRemoveStoryModal}/>
                </CloseXContainer>
              </StyledOverlay>
          }
          </ImageContainer>
          <StoryInfoContainer>
            {!isStory &&
              <Top>
                <GuideIcon name='guide' />
                <GuideIconText>Guide</GuideIconText>
              </Top>
            }
            <LocationPreview>{this.getLocationText()}</LocationPreview>
            <Title onClick={this.navToFeedItem}>{feedItem.title}</Title>
            {isStory && feedItem.description &&
              <Description>{feedItem.description}</Description>
            }
            <DetailsContainer between='xs'>
              <Row middle='xs'>
                {!isVertical &&
                  <Avatar
                    isStoryPreview
                    avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
                    size='avatar'
                    onClick={this.navToUserProfile}
                  />
                }
                {hasBadge &&
                  <BadgeIcon
                    name={author.role === 'contributor' ? 'profileBadge' : 'founderBadge'}
                    size='small'
                    profileAvatar={author.profile.avatar}
                  />
                }
                {!isVertical && <ByText>By&nbsp;</ByText>}
                <Username onClick={this.navToUserProfile}>{author.username}</Username>
                {!isVertical && <Text>, {moment(feedItem.createdAt).fromNow()}</Text>}
              </Row>
            </DetailsContainer>
            {!isVertical &&
              <Bottom>
                <LikeComponent
                  likes={formatCount(feedItem.counts.likes)}
                  isLiked={isLiked}
                  onClick={sessionUserId ? this._onClickLike : undefined}
                  horizontal
                />
                {isStory &&
                  <BookmarkIcon
                    name={isBookmarked ? 'bookmark-active' : 'bookmark'}
                    onClick={sessionUserId ? this._onClickBookmark : undefined}
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
    onClickStoryLike: (sessionUserId) => dispatch(StoryActions.storyLike(sessionUserId, feedItem.id)),
    onClickGuideLike: (sessionUserId) => dispatch(GuideActions.likeGuideRequest(feedItem.id, sessionUserId)),
    onClickGuideUnLike: (sessionUserId) => dispatch(GuideActions.unlikeGuideRequest(feedItem.id, sessionUserId)),
    onClickBookmark: (sessionUserId) => dispatch(StoryActions.storyBookmark(sessionUserId, feedItem.id)),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedItemPreview)

