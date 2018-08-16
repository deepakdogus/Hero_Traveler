import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'
import StoryActions from '../Shared/Redux/Entities/Stories'
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
  margin-bottom: 30px;
  margin-top: 7.5px;
`

const DetailsContainer = styled(Row)`
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
  letter-spacing: .4px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
`

const ByText = styled(Text)`
  margin-left: 7.5px;
`

const Username = styled(Text)`
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;

`

const BottomLeft = styled(Row)`
  position: absolute;
  bottom: 0;
  left: 0;
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

class StoryPreview extends Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    sessionUserId: PropTypes.string,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    reroute: PropTypes.func,
    onClickBookmark: PropTypes.func,
    onClickLike: PropTypes.func,
  }

  navToStory = () => {
    this.props.reroute(`/story/${this.props.story.id}`)
  }

  navToUserProfile = () => {
    this.props.reroute(`/profile/${this.props.author.id}/view`)
  }

  _onClickLike = () => {
    const {sessionUserId, onClickLike} = this.props
    onClickLike(sessionUserId)
  }

  _onClickBookmark = () => {
    const {sessionUserId, onClickBookmark} = this.props
    onClickBookmark(sessionUserId)
  }

  render() {
    const {
      story, author, sessionUserId,
      isLiked, isBookmarked,
    } = this.props

    if (!story || !author) return

    let imageUrl;
    if (story.coverImage) imageUrl = getImageUrl(story.coverImage)
    else if (story.coverVideo) {
      imageUrl = getImageUrl(story.coverVideo, 'optimized', videoThumbnailOptions)
    }

    return (
      <MarginWrapper>
        <Row>
          <CoverImage
            src={imageUrl}
            onClick={this.navToStory}
          />
          <StoryInfoContainer>
            <LocationPreview>{displayLocationPreview(story.locationInfo)}</LocationPreview>
            <Title onClick={this.navToStory}>{story.title}</Title>
            <Description>{story.description}</Description>
            <DetailsContainer between='xs'>
              <Row middle='xs'>
                <Avatar
                  avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
                  size='avatar'
                  onClick={this.navToUserProfile}
                />
                <ByText>By&nbsp;</ByText>
                <Username onClick={this.navToUserProfile}>{author.username}</Username>
                <Text>, {moment(story.createdAt).fromNow()}</Text>
              </Row>
            </DetailsContainer>
            <BottomLeft>
              <LikeComponent
                likes={formatCount(story.counts.likes)}
                isLiked={isLiked}
                onClick={sessionUserId ? this._onClickLike : undefined}
                horizontal
              />
              <BookmarkIcon
                name={isBookmarked ? 'bookmark-active' : 'bookmark'}
                onClick={sessionUserId ? this._onClickBookmark : undefined}
              />
            </BottomLeft>
          </StoryInfoContainer>
        </Row>
      </MarginWrapper>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const {session, entities} = state
  const sessionUserId = session.userId
  const {story} = ownProps

  let storyProps = null
  if (story) {
    storyProps = {
      author: entities.users.entities[story.author],
      isLiked: isStoryLiked(entities.users, sessionUserId, story.id),
      isBookmarked: isStoryBookmarked(entities.users, sessionUserId, story.id),
    }
  }

  return {
    sessionUserId: state.session.userId,
    ...storyProps,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const {story} = props
  return {
    onClickLike: (sessionUserId) => dispatch(StoryActions.storyLike(sessionUserId, story.id)),
    onClickBookmark: (sessionUserId) => dispatch(StoryActions.storyBookmark(sessionUserId, story.id)),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryPreview)

