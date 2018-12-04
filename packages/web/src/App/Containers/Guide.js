import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import _ from 'lodash'

import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import UserActions from '../Shared/Redux/Entities/Users'
import {
  isGuideLiked,
} from '../Shared/Redux/Entities/Users'
import UXActions from '../Redux/UXRedux'
import { runIfAuthed } from '../Lib/authHelpers'

import FeedItemHeader from '../Components/FeedItemHeader'
import {BodyText} from '../Components/StoryContentRenderer'
import GoogleMap from '../Components/GoogleMap'
import FeedItemMetaInfo from '../Components/FeedItemMetaInfo'
import FeedItemActionBar from '../Components/FeedItemActionBar'
import TabBar from '../Components/TabBar'
import FeedItemGrid from '../Components/FeedItemGrid'
import HorizontalDivider from '../Components/HorizontalDivider'
import Footer from '../Components/Footer'
import { createDeepLinkWeb } from '../Lib/sharingWeb'

const Container = styled.div`
  margin: 0 7%;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const wrapperMaxWidth = 960
const ContentWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: ${wrapperMaxWidth}px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`

const MetaInfoContainer = styled.div`
  padding-left: 0px;
  padding-right: 0px;
`

const DescriptionContainer = styled(MetaInfoContainer)``

const StyledDivider = styled(HorizontalDivider)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0 20px;
  }
`

const ConditionalDivider = styled(StyledDivider)`
  display: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: block;
  }
`

const Spacer = styled.div`
  height: 45px;
`

const Description = styled(BodyText)`
  padding: 0 45px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0 20px;
    margin-bottom: 35px;
  }
`

const HashtagText = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .2px;
  text-decoration: none;
  margin-bottom: 45px;
`

class Guide extends Component {
  static propTypes = {
    users: PropTypes.object,
    story: PropTypes.object,
    author: PropTypes.object,
    sessionUserId: PropTypes.string,
    isFollowing: PropTypes.bool,
    unfollowUser: PropTypes.func,
    followUser: PropTypes.func,
    reroute: PropTypes.func,
    isLiked: PropTypes.bool,
    onClickLike: PropTypes.func,
    // isBookmarked: PropTypes.bool,
    onClickBookmark: PropTypes.func,
    match: PropTypes.object,
    onClickComments: PropTypes.func,
    onClickFlag: PropTypes.func,
    guide: PropTypes.object,
    guideStories: PropTypes.arrayOf(PropTypes.object),
    getGuide: PropTypes.func,
    getGuideStories: PropTypes.func,
    onClickGuideLike: PropTypes.func,
    onClickGuideUnLike: PropTypes.func,
  }

  state = { activeTab: 'OVERVIEW' }

  componentDidMount() {
    if (!this.props.guide) {
      this.props.getGuide()
    }
    else this.checkForGuideStories()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.guide && this.props.guide) this.checkForGuideStories()
  }

  checkForGuideStories() {
    const {guide, guideStories, getGuideStories} = this.props
    if (guide.stories.length !== guideStories.length) {
      getGuideStories()
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
    const {sessionUserId} = this.props
    if (this.props.isLiked) this.props.onClickGuideUnLike(sessionUserId)
    else this.props.onClickGuideLike(sessionUserId)
  }

  _onClickBookmark = () => {
    this.props.onClickBookmark(this.props.sessionUserId)
  }

  _onClickComments = () => {
    this.props.onClickComments(this.props.sessionUserId)
  }

  _onClickFlag = (storyId) => {
    this.props.onClickFlag(this.props.sessionUserId, storyId)
  }

  _onClickShare = () => {
    createDeepLinkWeb(this.props.guide, 'guide')
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

  // onClickTab is the generic way we are dealing with TabBar clicks
  // in the future we will refactor so it immediately gives text
  // GuideStoriesOfType however also needs to trigger this so adding selectedTab
  onClickTab = (event, selectedTab) => {
    let tab = _.get(event, 'target.innerHTML', selectedTab)
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  getStoriesByType = (type) => {
    const { guideStories } = this.props
    return guideStories.filter(story => story.type === type)
  }

  shouldDisplay = (type) => {
    const {activeTab} = this.state
    return activeTab === 'OVERVIEW' || activeTab === type
  }

  getGuideStoriesOfTypeProps(type) {
    if (type === 'OVERVIEW') return {}
    const label = type === 'STAY' ? `PLACES TO STAY` : `THINGS TO ${type}`
    // onClickShowAll={this.onClickTab}
    return {
      type,
      label,
      isShowAll: this.state.activeTab === type,
      feedItems: this.getStoriesByType(type.toLowerCase()),
      onClickShowAll: this.onClickTab,
      guideId: this.props.match.params.guideId,
    }
  }

  getPossibleTabs = () => {
    const possibleTabs = ['OVERVIEW']
    this.props.guideStories.forEach(story => {
      const type = story.type.toUpperCase()
      if (possibleTabs.indexOf(type) === -1) possibleTabs.push(type)
    })
    return possibleTabs
  }

  render() {
    const {
      guide,
      author,
      reroute,
      sessionUserId,
      isFollowing,
      isLiked,
      // isBookmarked,
    } = this.props
    const { activeTab } = this.state

    if (!guide || !author) return null
    const selectedStoriesAndAuthors = this.getStoriesByType(activeTab.toLowerCase())

    return (
      <Container>
        <ContentWrapper>
          <FeedItemHeader
            feedItem={guide}
            author={author}
            reroute={reroute}
            sessionUserId={sessionUserId}
            isFollowing={isFollowing}
            followUser={this._followUser}
            unfollowUser={this._unfollowUser}
            shouldHideCover={this.state.activeTab !== 'OVERVIEW'}
          />
          {activeTab !== 'OVERVIEW' &&
            <GoogleMap
              stories={selectedStoriesAndAuthors}
              reroute={reroute}
            />
          }
          <TabBar
            tabs={this.getPossibleTabs()}
            activeTab={activeTab}
            onClickTab={this.onClickTab}
            whiteBG={true}
          />
          <Spacer />
          { guide &&
            guide.description &&
            activeTab === 'OVERVIEW' &&
            <DescriptionContainer>
              <Description>{guide.description}</Description>
              <ConditionalDivider color='light-grey'/>
            </DescriptionContainer>
          }
          {this.renderHashtags()}
          {activeTab === 'OVERVIEW' &&
            <MetaInfoContainer>
              <FeedItemMetaInfo feedItem={guide}/>
              <StyledDivider color='light-grey'/>
            </MetaInfoContainer>
          }
          {this.shouldDisplay('SEE') &&
            <FeedItemGrid {...this.getGuideStoriesOfTypeProps('SEE')} />
          }
          {this.shouldDisplay('DO') &&
            <FeedItemGrid {...this.getGuideStoriesOfTypeProps('DO')} />
          }
          {this.shouldDisplay('EAT') &&
            <FeedItemGrid {...this.getGuideStoriesOfTypeProps('EAT')} />
          }
          {this.shouldDisplay('STAY') &&
            <FeedItemGrid {...this.getGuideStoriesOfTypeProps('STAY')} />
          }
          <FeedItemActionBar
            isStory={false}
            feedItem={guide}
            isLiked={isLiked}
            onClickLike={this._onClickLike}
            // isBookmarked={isBookmarked}
            // onClickBookmark={this._onClickBookmark}
            onClickComments={this._onClickComments}
            onClickShare={this._onClickShare}
            userId={sessionUserId}
            reroute={reroute}
            wrapperMaxWidth={wrapperMaxWidth}
          />
        </ContentWrapper>
        <Footer hideOnTablet={true} />
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const guideId = ownProps.match.params.guideId
  const {guides, users} = state.entities
  const guide = guides.entities[guideId]
  const author = guide ? users.entities[guide.author] : undefined
  const stories = state.entities.stories.entities

  let isFollowing
  const sessionUserId = state.session.userId
  if (sessionUserId && author){
    const myFollowedUsersObject = users.userFollowingByUserIdAndId[sessionUserId]
    const myFollowedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined
    isFollowing = _.includes(myFollowedUsers, author.id)
  }

  let guideStories = guide ? guide.stories.map(storyId => {
    return stories[storyId]
  }) : []
  guideStories = guideStories.filter(story => !!story)

  return {
    guide,
    guideStories,
    author,
    users: users.entities,
    isFollowing,
    sessionUserId,
    isLiked: isGuideLiked(users, sessionUserId, guideId),
    // isBookmarked: isStoryBookmarked(state.entities.users, sessionUserId, guideId),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const guideId = ownProps.match.params.guideId

  return {
    getGuide: () => dispatch(GuideActions.getGuideRequest(guideId)),
    getGuideStories: () => dispatch(StoryActions.getGuideStories(guideId)),
    reroute: (path) => dispatch(push(path)),
    followUser: (sessionUserId, userIdToFollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.followUser, [sessionUserId, userIdToFollow])),
    unfollowUser: (sessionUserId, userIdToUnfollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.unfollowUser, [sessionUserId, userIdToUnfollow])),
    onClickGuideLike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, GuideActions.likeGuideRequest, [guideId, sessionUserId])),
    onClickGuideUnLike: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, GuideActions.unlikeGuideRequest, [guideId, sessionUserId])),
    // onClickBookmark: (sessionUserId) =>
    //    dispatch(runIfAuthed(sessionUserId, StoryActions.storyBookmark, [sessionUserId, storyId])),
    onClickComments: (sessionUserId) =>
      dispatch(runIfAuthed(sessionUserId, UXActions.openGlobalModal, ['comments', { guideId }])),
    onClickFlag: (sessionUserId, storyId) =>
      dispatch(runIfAuthed(sessionUserId, UXActions.openGlobalModal, ['flagStory', { storyId }])),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Guide)
