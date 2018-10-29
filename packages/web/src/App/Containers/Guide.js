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

import FeedItemHeader from '../Components/FeedItemHeader'
import {BodyText} from '../Components/StoryContentRenderer'
import GoogleMap from '../Components/GoogleMap'
import FeedItemMetaInfo from '../Components/FeedItemMetaInfo'
import FeedItemActionBar from '../Components/FeedItemActionBar'
import TabBar from '../Components/TabBar'
import GuideStoriesOfType from '../Components/GuideStoriesOfType'
import HorizontalDivider from '../Components/HorizontalDivider'
import Footer from '../Components/Footer'
import { createDeepLinkWeb } from '../Lib/sharingWeb'

const Container = styled.div`
  margin: 0 7%;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  padding-left: 80px;
  padding-right: 80px;
  max-width: 800px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`

const MetaInfoContainer = styled.div`
  padding-left: 0px;
  padding-right: 0px;
`
const ConditionalHorizontalDivider = styled(HorizontalDivider)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: none;
  }
`

const Spacer = styled.div`
  height: 45px;
`

const Description = styled(BodyText)`
  padding: 0 45px;
`

const HashtagText = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .2px;
  text-decoration: none;
  margin-botton: 45px;
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
    openGlobalModal: PropTypes.func,

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
    if (!this.props.sessionUserId) return
    if (this.props.isLiked) this.props.onClickGuideUnLike(sessionUserId)
    else this.props.onClickGuideLike(sessionUserId)
  }

  _onClickBookmark = () => {
    if (!this.props.sessionUserId) return
    this.props.onClickBookmark(this.props.sessionUserId)
  }

  _onClickComments = () => {
    this.props.onClickComments()
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

  getStoriesAndAuthorsByType = (type) => {
    const {guideStories, users} = this.props
    const authors = {}
    const storiesOfType = guideStories.filter(story => {
      if (story.type === type) {
        if (!authors[story.author]) authors[story.author] = users[story.author]
        return true
      }
      else return false
    })
    return {
      stories: storiesOfType,
      authors: authors,
    }
  }

  shouldDisplay = (type) => {
    const {activeTab} = this.state
    return activeTab === 'OVERVIEW' || activeTab === type
  }

  getGuideStoriesOfTypeProps(type) {
    const { activeTab } = this.state
    if (type === 'OVERVIEW') return {}
    const label = type === 'STAY' ? `PLACES TO STAY` : `THINGS TO ${type}`
    // onClickShowAll={this.onClickTab}
    return {
      guideId: this.props.guide.id,
      type,
      label,
      isShowAll: activeTab === type,
      ...this.getStoriesAndAuthorsByType(type.toLowerCase()),
      onClickShowAll: this.onClickTab,
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
      // isBookmarked,
      isLiked,
      openGlobalModal,
    } = this.props
    const { activeTab } = this.state

    if (!guide || !author) return null
    const selectedStoriesAndAuthors = this.getStoriesAndAuthorsByType(activeTab.toLowerCase())

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
              stories={selectedStoriesAndAuthors.stories}
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
            <Description>{guide.description}</Description>
          }
          {this.renderHashtags()}
          {activeTab === 'OVERVIEW' &&
            <MetaInfoContainer>
              <FeedItemMetaInfo feedItem={guide}/>
              <ConditionalHorizontalDivider color='light-grey'/>
            </MetaInfoContainer>
          }
          {this.shouldDisplay('SEE') &&
            <GuideStoriesOfType {...this.getGuideStoriesOfTypeProps('SEE')} />
          }
          {this.shouldDisplay('DO') &&
            <GuideStoriesOfType {...this.getGuideStoriesOfTypeProps('DO')} />
          }
          {this.shouldDisplay('EAT') &&
            <GuideStoriesOfType {...this.getGuideStoriesOfTypeProps('EAT')} />
          }
          {this.shouldDisplay('STAY') &&
            <GuideStoriesOfType {...this.getGuideStoriesOfTypeProps('STAY')} />
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
            openGlobalModal={openGlobalModal}
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
    followUser: (sessionUserId, userIdToFollow) => dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
    unfollowUser: (sessionUserId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
    onClickGuideLike: (sessionUserId) => dispatch(GuideActions.likeGuideRequest(guideId, sessionUserId)),
    onClickGuideUnLike: (sessionUserId) => dispatch(GuideActions.unlikeGuideRequest(guideId, sessionUserId)),
    // onClickBookmark: (sessionUserId) => dispatch(StoryActions.storyBookmark(sessionUserId, storyId)),
    onClickComments: () => dispatch(UXActions.openGlobalModal('comments', { guideId })),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Guide)
