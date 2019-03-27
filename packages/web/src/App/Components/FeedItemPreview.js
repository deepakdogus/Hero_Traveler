import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types'

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

import Avatar from '../Shared/Web/Components/Avatar'
import LikeComponent from './LikeComponent'
import { Row } from '../Shared/Web/Components/FlexboxGrid'
import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import Icon from '../Shared/Web/Components/Icon'

import OverlayHover from './OverlayHover'

import {
  roleToIconName,
  hasBadge,
} from '../Shared/Lib/badgeHelpers'
import isLocalDraft from '../Shared/Lib/isLocalDraft'

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

const ListMarginWrapper = styled.div`
  max-width: 960px;
  margin: auto;
  color: ${props => props.theme.Colors.lightGrey};
`

const GridMarginWrapper = styled(ListMarginWrapper)`
  margin: 0;
  flex-basis: 285px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    max-width: 100%;
    margin: 0;
    width: 100%;
  }
`

const ListRowWrapper = styled(Row)`
  flex-wrap: nowrap;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    flex-direction: column;
    justify-content: center;
  }
`

const GridWrapper = styled.div`
  margin: 0;
`

const ListStoryInfoContainer = styled(VerticalCenter)`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  flex-basis: 550px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height:auto;
    width: auto;
    flex-basis: unset;
    margin: 0 15px;
  }
`

const GridStoryInfoContainer = styled(ListStoryInfoContainer)`
  height: auto;
  margin-left: 0;
  > * {
    padding: 5px 0px
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    > * {
      padding-top: 0px;
    }
  }
`

const LocationPreview = styled(Text)`
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 6px;
  text-transform: uppercase;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 13px;
    margin: 0;
  }
`

const Title = styled.h3`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: ${props => props.isList ? 600 : 500};
  font-size: ${props => props.isList ? '25px' : '19px'};
  color: ${props => props.theme.Colors.background};
  display: inline-block;
  margin: 0;
  cursor: pointer;
  letter-spacing: .6px;
  word-break: break-word;
  padding: 5px 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: '15px';
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
const GridImageContainer = styled(ImageWrapper)`
  width: auto;
  height: 0;
  padding-bottom: 70.84%;
  background: center url(${props => props.src});
  background-size: cover;
`

const ListImageContainer = styled(ImageWrapper)`
  margin-right: 20px;
  width: 385.5px;
  height: 257px;
  background: center url(${props => props.src});
  background-size: cover;
  flex-shrink: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
    margin-bottom: 15px;
    max-width: 100vw;
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

const GuideIconText = styled(LocationPreview)`
  padding-left: 10px;
`

const Username = styled(Text)`
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0.7px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const TopRow = styled(Row)`
  height: 35px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 0;
  }
`

const ListMiddleRow = styled(Row)`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  min-height: 135px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    min-height: unset;
  }
`

const GridMiddleRow = styled(ListMiddleRow)`
  min-height: inherit;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    min-height: unset;
  }
`

const BottomRow = styled(Row)``

const UserRow = styled(Row)``

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

const InlineGuideIcon = styled(Icon)`
  padding-right: 7px;
  width: 14px;
  height: 14px;
`

const BookmarkIcon = styled(Icon)`
  margin: 0 5px;
  cursor: pointer;
`

const DeleteIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  align-self: center;
  cursor: pointer;
`

const AvatarTextStyles = `
  margin-right: 7.5px;
`

const videoThumbnailOptions = {
  video: true,
  width: 285,
}

class FeedItemPreview extends Component {
  static propTypes = {
    type: PropTypes.string,
    feedItem: PropTypes.object,
    sessionUserId: PropTypes.string,
    author: PropTypes.object,
    guideId: PropTypes.string,
    isStory: PropTypes.bool,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    reroute: PropTypes.func,
    onClickBookmark: PropTypes.func,
    onClickRemoveBookmark: PropTypes.func,
    onClickStoryLike: PropTypes.func,
    onClickStoryUnlike: PropTypes.func,
    onClickGuideLike: PropTypes.func,
    onClickGuideUnLike: PropTypes.func,
    openGlobalModal: PropTypes.func,
  }

  defaultProps = {
    isStory: true,
  }

  navToFeedItem = () => {
    const { isStory, feedItem } = this.props
    const storyOrGuide = isStory ? 'story' : 'guide'
    if (isLocalDraft(feedItem.id)) this.props.reroute(`/editStory/${feedItem.id}/cover`)
    else this.props.reroute(`/${storyOrGuide}/${feedItem.id}`)
  }

  navToUserProfile = () => {
    this.props.reroute(`/profile/${this.props.author.id}/view`)
  }

  _onClickLike = () => {
    const {
      sessionUserId, isLiked, isStory,
      onClickStoryLike, onClickStoryUnlike,
      onClickGuideLike, onClickGuideUnLike,
    } = this.props

    if (isStory) {
      if (isLiked) onClickStoryUnlike(sessionUserId)
      else onClickStoryLike(sessionUserId)
    }
    else {
      if (isLiked) onClickGuideUnLike(sessionUserId)
      else onClickGuideLike(sessionUserId)
    }
  }

  _onClickBookmark = () => {
    const {
      isBookmarked, sessionUserId,
      onClickBookmark, onClickRemoveBookmark,
    } = this.props
    if (isBookmarked) return onClickRemoveBookmark(sessionUserId)
    return onClickBookmark(sessionUserId)
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
      sessionUserId,
      isLiked,
      isBookmarked,
      isStory,
      type,
    } = this.props

    const isList = type === 'list'
    const isGuideAuthor = !!guideId && sessionUserId === this.props.author.id

    /*
     * in cases where story/guide is retrieved from algolia, author prop will be
     * undefined, so it is currently necessary to recreate an empty
     * author object to avoid access errors. Thus, no algolia derived story/
     * guide results will have avatar or role. If these are needed:
     *  1) perform an author check in lifecycle method
     *  2) make api call to get story/guide by authorId (authorId in feedItem)
     */
    let author = {username: '', profile: {avatar: ''}, role: ''}
    if (this.props.author) author = this.props.author
    else author.username = feedItem.author

    let imageUrl
    if (feedItem.coverImage) imageUrl = getImageUrl(feedItem.coverImage)
    else if (feedItem.coverVideo) {
      imageUrl = getImageUrl(feedItem.coverVideo, 'optimized', videoThumbnailOptions)
    }

    const MarginWrapper = type === 'grid' ? GridMarginWrapper : ListMarginWrapper
    const DirectionalWrapper = type === 'grid' ? GridWrapper : ListRowWrapper
    const ImageContainer = type === 'grid' ? GridImageContainer : ListImageContainer
    const StoryInfoContainer = type === 'grid' ? GridStoryInfoContainer : ListStoryInfoContainer
    const MiddleRow = type === 'grid' ? GridMiddleRow : ListMiddleRow

    return (
      <MarginWrapper>
        <DirectionalWrapper>
          <ImageContainer
            onClick={guideId ? this.noop : this.navToFeedItem}
            src={imageUrl}
          >
            <StyledOverlay overlayColor='black' >
              {isGuideAuthor && (
                <CloseXContainer onClick={this.openRemoveStoryModal}>
                  <DeleteIcon
                    size='small'
                    name='closeBlack'
                  />
                </CloseXContainer>
              )}
            </StyledOverlay>
          </ImageContainer>
          <StoryInfoContainer>
            {isList && (
              <TopRow>
                {!isStory && <GuideIcon name='guide' />}
                {!isStory && <GuideIconText>Guide</GuideIconText>}
              </TopRow>
            )}
            <MiddleRow>
              {isList
                && <LocationPreview>{this.getLocationText()}</LocationPreview>
              }
              <Title
                onClick={this.navToFeedItem}
                isGuide={!!guideId}
                isList={isList}
              >
                {!isStory && !isList && <InlineGuideIcon name='guide' />}
                {feedItem.title}
              </Title>
              {isList && (
                <UserRow middle='xs'>
                  <Avatar
                    iconTextProps={AvatarTextStyles}
                    imageTextProps={AvatarTextStyles}
                    avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
                    isStoryPreview
                    size='avatar'
                    type='profile'
                    onClick={this.navToUserProfile}
                  />
                  {hasBadge(author.role) && (
                    <BadgeIcon
                      name={roleToIconName[author.role]}
                      size='small'
                      profileAvatar={author.profile.avatar}
                    />
                  )}
                  {author.username && (
                      <Username
                        onClick={this.navToUserProfile}
                      >
                          {author.username}
                      </Username>
                  )}
                </UserRow>
              )}
            </MiddleRow>
            <BottomRow>
              {isList && (
                <LikeComponent
                  likes={formatCount(feedItem.counts.likes)}
                  isLiked={isLiked}
                  onClick={this._onClickLike}
                  horizontal
                />
              )}
              {isList
                && isStory
                && (
                  <BookmarkIcon
                    name={isBookmarked ? 'feedBookmarkActive' : 'feedBookmark'}
                    onClick={this._onClickBookmark}
                  />
                )
              }
              {!isList
                && author.username
                && (
                  <Username
                    onClick={this.navToUserProfile}
                  >
                    {author.username}
                  </Username>
                )
              }
            </BottomRow>
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
    /* TODO: fix author logic to better accomodate cases where author
     * is not in redux (i.e., when coming from an algolia query)
     *
     * author will be undefined when algolia results are passed as a feedItem:
     *  - algolia story author = username (historical reasons)
     *  - algolia guide author = username (for consistency across algolia)
     *
     */
    feedItemProps = {
      author: entities.users.entities[feedItem.author],
      isBookmarked: isStoryBookmarked(entities.users, sessionUserId, feedItem.id),
    }
    feedItemProps.isLiked = isStory
      ? isStoryLiked(entities.users, sessionUserId, feedItem.id)
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
      dispatch(runIfAuthed(sessionUserId, StoryActions.likeStoryRequest, [feedItem.id, sessionUserId])),
    onClickStoryUnlike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.unlikeStoryRequest, [feedItem.id, sessionUserId])),
    onClickGuideLike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, GuideActions.likeGuideRequest, [feedItem.id, sessionUserId])),
    onClickGuideUnLike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, GuideActions.unlikeGuideRequest, [feedItem.id, sessionUserId])),
    onClickBookmark: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.bookmarkStoryRequest, [feedItem.id])),
    onClickRemoveBookmark: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.removeStoryBookmarkRequest, [feedItem.id])),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedItemPreview)
