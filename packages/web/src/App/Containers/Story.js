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
import { runIfAuthed } from '../Lib/authHelpers'

import FeedItemHeader from '../Components/FeedItemHeader'
import StoryContentRenderer from '../Components/StoryContentRenderer'
import GoogleMap from '../Components/GoogleMap'
import FeedItemMetaInfo from '../Components/FeedItemMetaInfo'
import RoundedButton from '../Shared/Web/Components/RoundedButton'
import Icon from '../Shared/Web/Components/Icon'
import FeedItemActionBar from '../Components/FeedItemActionBar'
import Footer from '../Components/Footer'
import { createDeepLinkWeb } from '../Lib/sharingWeb'

const Container = styled.div`
  margin: 0 7%;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const wrapperMaxWidth = 800
const ContentWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: ${wrapperMaxWidth}px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`

const MapContainer = styled.div`
  margin: 60px 0;
`

const HashtagText = styled.p`
  margin: 0;
  padding-top: 30px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .2px;
  text-decoration: none;
`

const AddToGuideButtonStyles = `
  display: none;
`

const responsiveAddToGuideButtonStyles = `
  display: block;
  position: fixed;
  bottom: 50px;
  right: 0px;
`

const StyledIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  align-self: center;
  cursor: pointer;
`

const AddToGuideButton = ({ onClickAddToGuide }) => (
  <RoundedButton
    type={'floating'}
    padding='even'
    margin='medium'
    width='40px'
    height='40px'
    onClick={onClickAddToGuide}
    buttonProps={AddToGuideButtonStyles}
    responsiveButtonProps={responsiveAddToGuideButtonStyles}
  >
    <StyledIcon name='addLarge'/>
  </RoundedButton>
)

class Story extends Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    sessionUserId: PropTypes.string,
    isDraft: PropTypes.bool,
    isFollowing: PropTypes.bool,
    unfollowUser: PropTypes.func,
    followUser: PropTypes.func,
    getStory: PropTypes.func,
    reroute: PropTypes.func,
    isLiked: PropTypes.bool,
    onClickLike: PropTypes.func,
    onClickUnLike: PropTypes.func,
    isBookmarked: PropTypes.bool,
    onClickBookmark: PropTypes.func,
    onClickRemoveBookmark: PropTypes.func,
    match: PropTypes.object,
    onClickComments: PropTypes.func,
    onClickAddToGuide: PropTypes.func,
    onClickFlag: PropTypes.func,
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
    const { sessionUserId } = this.props
    if (this.props.isLiked) this.props.onClickUnLike(sessionUserId)
    else this.props.onClickLike(sessionUserId)
  }

  _onClickBookmark = () => {
    const {
      isBookmarked, sessionUserId,
      onClickBookmark, onClickRemoveBookmark,
    } = this.props
    if (isBookmarked) return onClickRemoveBookmark(sessionUserId)
    return onClickBookmark(sessionUserId)
  }

  _onClickComments = () => {
    this.props.onClickComments(this.props.sessionUserId)
  }

  _onClickFlag = (storyId) => {
    this.props.onClickFlag(this.props.sessionUserId, storyId)
  }

  _onClickShare = async () => {
    createDeepLinkWeb(this.props.story, 'story')
  }

  hasLatLng = () => {
    const { story } = this.props
    return story.locationInfo
      && story.locationInfo.latitude
      && story.locationInfo.longitude
  }

  renderHashtags = () => {
    const {story} = this.props
    if (!story.hashtags || !story.hashtags.length) return null

    const hashtagMap = story.hashtags.map((hashtag) => `#${hashtag.title}`)

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
      isDraft,
      isFollowing,
      isBookmarked,
      isLiked,
      onClickAddToGuide,
    } = this.props

    if (!story || !author) return null

    return (
      <Container>
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
            isDraft={isDraft}
          />
          <StoryContentRenderer story={story} />
          {this.renderHashtags()}
          {this.hasLatLng() && (
            <MapContainer>
              <GoogleMap stories={ [story] } />
            </MapContainer>
          )}
          <FeedItemMetaInfo feedItem={story} />
          {!isDraft && (<AddToGuideButton onClickAddToGuide={onClickAddToGuide}/>)}
          {!isDraft && (
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
              onClickShare={this._onClickShare}
              onClickFlag={this._onClickFlag}
              wrapperMaxWidth={wrapperMaxWidth}
            />
          )}
        </ContentWrapper>
        <Footer hideOnTablet={true}/>
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const storyId = ownProps.match.params.storyId
  const story = state.entities.stories.entities[storyId]
  const author = story ? state.entities.users.entities[story.author] : undefined
  const isDraft = storyId.includes('local')

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
    isDraft,
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
    followUser: (sessionUserId, userIdToFollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.followUser, [sessionUserId, userIdToFollow])),
    unfollowUser: (sessionUserId, userIdToUnfollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.unfollowUser, [sessionUserId, userIdToUnfollow])),
    onClickLike: sessionUserId =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.likeStoryRequest, [storyId, sessionUserId])),
    onClickUnLike: sessionUserId =>
      dispatch(
        runIfAuthed(sessionUserId, StoryActions.unlikeStoryRequest, [storyId, sessionUserId]),
    ),
    onClickBookmark: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.bookmarkStoryRequest, [storyId])),
    onClickRemoveBookmark: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, StoryActions.removeStoryBookmarkRequest, [storyId])),
    onClickComments: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, UXActions.openGlobalModal, ['comments', { storyId }])),
    onClickAddToGuide: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, UXActions.openGlobalModal, ['guidesSelect', { storyId }])),
    onClickFlag: (sessionUserId, storyId) =>
      dispatch(runIfAuthed(sessionUserId, UXActions.openGlobalModal, ['flagStory', { storyId }])),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Story)
