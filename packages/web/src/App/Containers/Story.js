import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {push} from 'react-router-redux'
import _ from 'lodash'

import {feedExample} from './Feed_TEST_DATA'
import StoryActions from '../Shared/Redux/Entities/Stories'
import UserActions from '../Shared/Redux/Entities/Users'
import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'

import Header from '../Components/Header'
import StoryHeader from '../Components/StoryHeader'
import StoryContentRenderer from '../Components/StoryContentRenderer'
import GMap from '../Components/GoogleMap'
import StoryMetaInfo from '../Components/StoryMetaInfo'
import StoryActionBar from '../Components/StoryActionBar'
import StorySuggestions from '../Components/StorySuggestions'


const ContentWrapper = styled.div``

const LimitedWidthContainer = styled.div`
  width: 66%;
  max-width: 900px;
  margin: 0 auto;
`

const GreyWrapper = styled.div`
  background-color: ${props => props.theme.Colors.dividerGrey};
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

  render() {
    const {
      story, author, reroute, sessionUserId,
      isFollowing, isBookmarked, isLiked,
    } = this.props
    if (!story || !author) return null
    const suggestedStories = Object.keys(feedExample).map(key => {
      return feedExample[key]
    })
    return (
      <ContentWrapper>
        <Header isLoggedIn></Header>
        <LimitedWidthContainer>
          <StoryHeader
            story={story}
            author={author}
            reroute={reroute}
            sessionUserId={sessionUserId}
            isFollowing={isFollowing}
            followUser={this._followUser}
            unfollowUser={this._unfollowUser}
          />
          <StoryContentRenderer story={story} />
          <p style={{paddingLeft: '10px'}}>Are they trying to do fixed map and/or hidden buttons on the map?</p>
          {story.latitude && story.longitude &&
            <GMap
              lat={story.latitude}
              lng={story.longitude}
              location={story.location}
            />
          }
          <StoryMetaInfo story={story}/>
        </LimitedWidthContainer>
        <GreyWrapper>
          <LimitedWidthContainer>
            <StorySuggestions suggestedStories={suggestedStories}/>
          </LimitedWidthContainer>
        </GreyWrapper>
        <StoryActionBar
          story={story}
          isLiked={isLiked}
          onClickLike={this._onClickLike}
          isBookmarked={isBookmarked}
          onClickBookmark={this._onClickBookmark}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Story)
