import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {push} from 'react-router-redux'
import _ from 'lodash'

import {feedExample} from './Feed_TEST_DATA'
import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import UserActions from '../Shared/Redux/Entities/Users'
import {
  isStoryLiked,
  isStoryBookmarked,
  isGuideLiked,
} from '../Shared/Redux/Entities/Users'
import UXActions from '../Redux/UXRedux'

import FeedItemHeader from '../Components/FeedItemHeader'
import {BodyText as Description} from '../Components/StoryContentRenderer'
import StoryContentRenderer from '../Components/StoryContentRenderer'
import GMap from '../Components/GoogleMap'
import FeedItemMetaInfo from '../Components/FeedItemMetaInfo'
import StoryActionBar from '../Components/StoryActionBar'
import TabBar from '../Components/TabBar'

const ContentWrapper = styled.div``

const LimitedWidthContainer = styled.div`
  padding-left: 45px;
  padding-right: 45px;
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

const tabBarTabs = ['OVERVIEW', 'SEE', 'DO', 'EAT', 'STAY']

class Guide extends Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    sessionUserId: PropTypes.string,
    isFollowing: PropTypes.bool,
    unfollowUser: PropTypes.func,
    followUser: PropTypes.func,
    reroute: PropTypes.func,
    isLiked: PropTypes.bool,
    onClickLike: PropTypes.func,
    isBookmarked: PropTypes.bool,
    onClickBookmark: PropTypes.func,
    match: PropTypes.object,
    onClickComments: PropTypes.func,
    flagStory: PropTypes.func,
    openGlobalModal: PropTypes.func,
  }

  state = { activeTab: 'OVERVIEW' }

  componentDidMount() {
    if (!this.props.guide) {
      this.props.getGuide(this.props.match.params.guideId)
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

  renderHashtags = () => {
    const {guide} = this.props
    if (!guide.hashtags) return null

    const hashtagMap = guide.hashtags.map((hashtag) => {
      return `#${hashtag.title}`
    })

    return (
      <HashtagText>
        {hashtagMap.join(', ')}
      </HashtagText>
    )
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab }, () => {
        // this.getTabInfo(tab)
      })
    }
  }

  render() {
    const {
      story,
      guide,
      author,
      reroute,
      sessionUserId,
      isFollowing,
      isBookmarked,
      isLiked,
      flagStory,
      openGlobalModal,
    } = this.props
    if (!guide || !author) return null
    const suggestedStories = Object.keys(feedExample).map(key => {
      return feedExample[key]
    })



    return (
      <ContentWrapper>
        <FeedItemHeader
          feedItem={guide}
          author={author}
          reroute={reroute}
          sessionUserId={sessionUserId}
          isFollowing={isFollowing}
          followUser={this._followUser}
          unfollowUser={this._unfollowUser}
        />
        <LimitedWidthContainer>
          <TabBar
            tabs={tabBarTabs}
            activeTab={this.state.activeTab}
            onClickTab={this.onClickTab}
          />
          <Description>{guide.description}</Description>
          {this.renderHashtags()}
          <FeedItemMetaInfo feedItem={guide}/>
        </LimitedWidthContainer>
        {

        // <LimitedWidthContainer>
        //   <StoryContentRenderer story={story} />
        //   {this.renderHashtags()}
        //   {story.locationInfo && story.locationInfo.latitude && story.locationInfo.longitude &&
        //     <GMap
        //       lat={story.locationInfo.latitude}
        //       lng={story.locationInfo.longitude}
        //       location={story.locationInfo.name}
        //     />
        //   }
        //   <FeedItemMetaInfo story={story}/>
        // </LimitedWidthContainer>
        }
        {
        // <StoryActionBar
        //   story={story}
        //   isLiked={isLiked}
        //   onClickLike={this._onClickLike}
        //   isBookmarked={isBookmarked}
        //   onClickBookmark={this._onClickBookmark}
        //   onClickComments={this._onClickComments}
        //   flagStory={flagStory}
        //   userId={sessionUserId}
        //   reroute={reroute}
        //   openGlobalModal={openGlobalModal}
        // />
        }
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const guideId = ownProps.match.params.guideId
  const {guides, users} = state.entities
  const guide = guides.entities[guideId]
  const author = guide ? users.entities[guide.author] : undefined

  let isFollowing
  const sessionUserId = state.session.userId
  if (sessionUserId && author){
    const myFollowedUsersObject = users.userFollowingByUserIdAndId[sessionUserId]
    const myFollowedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined
    isFollowing = _.includes(myFollowedUsers, author.id)
  }

  return {
    guide,
    author,
    isFollowing,
    sessionUserId,
    isLiked: isGuideLiked(users, sessionUserId, guideId),
    // isBookmarked: isStoryBookmarked(state.entities.users, sessionUserId, guideId),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const storyId = ownProps.match.params.storyId
  return {
    getGuide: (guideId) => dispatch(GuideActions.getGuideRequest(guideId)),
    reroute: (path) => dispatch(push(path)),
    followUser: (sessionUserId, userIdToFollow) => dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
    unfollowUser: (sessionUserId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
    onClickLike: (sessionUserId) => dispatch(StoryActions.storyLike(sessionUserId, storyId)),
    onClickComments: () => dispatch(UXActions.openGlobalModal('comments', { storyId })),
    flagStory: (sessionUserId, storyId) => dispatch(StoryActions.flagStory(sessionUserId, storyId)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Guide)
