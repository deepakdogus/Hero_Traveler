import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
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
import { displayLocationPreview } from '../Shared/Lib/locationHelpers'

import Avatar from './Avatar'
import LikeComponent from './LikeComponent'
import {Row} from './FlexboxGrid'
import VerticalCenter from './VerticalCenter'
import Icon from './Icon'

const coverHeight = '257px'

const MarginWrapper = styled.div`
  position: relative;
  max-width: 960px;
  margin: auto;
  color: ${props => props.theme.Colors.lightGrey};
`

const StoryInfoContainer = styled(VerticalCenter)`
  position: relative;
  height: ${coverHeight};
  margin-left: 20px;
`

const Title = styled.h3`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 23px;
  color: ${props => props.theme.Colors.background};
  display: inline-block;
  margin: 0;
  cursor: pointer;
  &:hover {
    color: #757575;
  }
`

const Description = styled.h2`
  font-size: 16px;
  letter-spacing: .7px;
  color : ${props => props.theme.Colors.grey};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  margin-top: 7.5px;
  margin-bottom: 0;
`

const DetailsContainer = styled(Row)`
  padding-top: 13px;
  display: flex;
  position: relative;
`

const CoverImage = styled.img`
  width: 385.5px;
  height: ${coverHeight};
  object-fit: cover;
  cursor: pointer;
`

const Text = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  font-size: 15px;
  color: ${props => props.theme.Colors.grey};
`

const LocationPreview = styled(Text)`
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
`

const GuideIconText = styled(LocationPreview)`
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
`

const Bottom = styled(Row)`
  position: absolute;
  bottom: 0;
  left: 0;
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
    sessionUserId: PropTypes.string,
    isStory: PropTypes.bool,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    reroute: PropTypes.func,
    onClickBookmark: PropTypes.func,
    onClickStoryLike: PropTypes.func,
    onClickGuideLike: PropTypes.func,
    onClickGuideUnLike: PropTypes.func,
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

  render() {
    const {
      feedItem,
      author,
      sessionUserId,
      isLiked,
      isBookmarked,
      isStory,
    } = this.props

    if (!feedItem || !author) return

    let imageUrl;
    if (feedItem.coverImage) imageUrl = getImageUrl(feedItem.coverImage)
    else if (feedItem.coverVideo) {
      imageUrl = getImageUrl(feedItem.coverVideo, 'optimized', videoThumbnailOptions)
    }

    return (
      <MarginWrapper>
        <Row>
          <CoverImage
            src={imageUrl}
            onClick={this.navToFeedItem}
          />
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
                <Avatar
                  avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
                  size='avatar'
                  onClick={this.navToUserProfile}
                />
                <ByText>By&nbsp;</ByText>
                <Username onClick={this.navToUserProfile}>{author.username}</Username>
                <Text>, {moment(feedItem.createdAt).fromNow()}</Text>
              </Row>
            </DetailsContainer>
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
          </StoryInfoContainer>
        </Row>
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

