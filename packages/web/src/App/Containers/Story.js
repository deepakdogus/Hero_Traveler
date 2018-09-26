import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {push} from 'react-router-redux'
import _ from 'lodash'

import StoryActions from '../Shared/Redux/Entities/Stories'
import UserActions from '../Shared/Redux/Entities/Users'
import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import UXActions from '../Redux/UXRedux'

import FeedItemHeader from '../Components/FeedItemHeader'
import StoryContentRenderer from '../Components/StoryContentRenderer'
import GoogleMap from '../Components/GoogleMap'
import FeedItemMetaInfo from '../Components/FeedItemMetaInfo'
import FeedItemActionBar from '../Components/FeedItemActionBar'
import { createDeepLinkWeb } from '../Shared/Lib/sharingWeb'

const ContentWrapper = styled.div``

const LimitedWidthContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const HashtagText = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .7px;
  text-decoration: none;
  margin-botton: 45px;
`

class Story extends Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    sessionUserId: PropTypes.string,
    isFollowing: PropTypes.bool,
    unfollowUser: PropTypes.func,
    followUser: PropTypes.func,
    getStory: PropTypes.func,
    reroute: PropTypes.func,
    isLiked: PropTypes.bool,
    onClickLike: PropTypes.func,
    isBookmarked: PropTypes.bool,
    onClickBookmark: PropTypes.func,
    match: PropTypes.object,
    onClickComments: PropTypes.func,
    openGlobalModal: PropTypes.func,
    onClickAddToGuide: PropTypes.func,
  }

  componentDidMount() {
    if (!this.props.story) {
      this.props.getStory(this.props.match.params.storyId)
    }
  }

  _followUser = () => {
    const {sessionUserId, author, followUser} = this.props
    followUser(sessionUserId, author.id)
  }

  _unfollowUser = () => {
    const {sessionUserId, author, unfollowUser} = this.props
    unfollowUser(sessionUserId, author.id)
  }

  _onClickLike = () => {
    if (!this.props.sessionUserId) return
    this.props.onClickLike(this.props.sessionUserId)
  }

  _onClickBookmark = () => {
    if (!this.props.sessionUserId) return
    this.props.onClickBookmark(this.props.sessionUserId)
  }

  _onClickComments = () => {
    this.props.onClickComments()
  }

  _onClickShare = async () => {
    createDeepLinkWeb(this.props.story, 'story')
  }

  renderHashtags = () => {
    const {story} = this.props
    if (!story.hashtags) return null

    const hashtagMap = story.hashtags.map((hashtag) => {
      return `#${hashtag.title}`
    })

    return (
      <HashtagText>
        {hashtagMap.join(', ')}
      </HashtagText>
    )
  }

  render() {
    const {
      story,
      author,
      reroute,
      sessionUserId,
      isFollowing,
      isBookmarked,
      isLiked,
      openGlobalModal,
      onClickAddToGuide,
    } = this.props
    if (!story || !author) return null

    return (
      <ContentWrapper>
        <FeedItemHeader
          feedItem={story}
          author={author}
          reroute={reroute}
          sessionUserId={sessionUserId}
          isFollowing={isFollowing}
          followUser={this._followUser}
          unfollowUser={this._unfollowUser}
          onClickAddToGuide={onClickAddToGuide}
          isStory
        />
        <LimitedWidthContainer>
          <StoryContentRenderer story={story} />
          {this.renderHashtags()}
          {story.locationInfo && story.locationInfo.latitude && story.locationInfo.longitude &&
            <GoogleMap stories={ [story] } />
          }
          <FeedItemMetaInfo feedItem={story} />
        </LimitedWidthContainer>
        <FeedItemActionBar
          feedItem={story}
          isStory
          isLiked={isLiked}
          onClickLike={this._onClickLike}
          isBookmarked={isBookmarked}
          onClickBookmark={this._onClickBookmark}
          onClickComments={this._onClickComments}
          userId={sessionUserId}
          reroute={reroute}
          openGlobalModal={openGlobalModal}
          onClickShare={this._onClickShare}
        />
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const storyId = ownProps.match.params.storyId
  const story = state.entities.stories.entities[storyId]
  const author = story ? state.entities.users.entities[story.author] : undefined

  let isFollowing
  const sessionUserId = state.session.userId
  if (sessionUserId && author){
    const myFollowedUsersObject = state.entities.users.userFollowingByUserIdAndId[sessionUserId]
    const myFollowedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined
    isFollowing = _.includes(myFollowedUsers, author.id)
  }

  return {
    story,
    author,
    isFollowing,
    sessionUserId,
    isLiked: isStoryLiked(state.entities.users, sessionUserId, storyId),
    isBookmarked: isStoryBookmarked(state.entities.users, sessionUserId, storyId),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const storyId = ownProps.match.params.storyId
  return {
    getStory: (storyId, tokens) => dispatch(StoryActions.storyRequest(storyId)),
    reroute: (path) => dispatch(push(path)),
    followUser: (sessionUserId, userIdToFollow) => dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
    unfollowUser: (sessionUserId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
    onClickLike: (sessionUserId) => dispatch(StoryActions.storyLike(sessionUserId, storyId)),
    onClickBookmark: (sessionUserId) => dispatch(StoryActions.storyBookmark(sessionUserId, storyId)),
    onClickComments: () => dispatch(UXActions.openGlobalModal('comments', { storyId })),
    onClickAddToGuide: () => dispatch(UXActions.openGlobalModal('guidesSelect', { storyId })),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Story)
