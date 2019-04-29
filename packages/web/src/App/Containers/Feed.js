import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import ContainerWithFeedList from './ContainerWithFeedList'
import FeedItemList from '../Components/FeedItemList'
import FeedHeader from '../Components/FeedHeader'
import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignUpActions from '../Shared/Redux/SignupRedux'
import Footer from '../Components/Footer'
import HorizontalDivider from '../Components/HorizontalDivider'
import TabBar from '../Components/TabBar'
import { sizes } from '../Themes/Metrics'

const CenteredText = styled.p`
  text-align: center;
`

const FeedText = styled(CenteredText)`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 0.6px;
  padding: 30px 0 0 0;
  @media (max-width: ${sizes.tablet}px) {
    padding: 20px;
    font-size: 18px;
  }
`

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 0 7%;
  @media (max-width: ${sizes.tablet}px) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`
const StyledDivider = styled(HorizontalDivider)`
  border-color: ${props => props.theme.Colors.background};
  border-width: 1px;
  margin-bottom: 23px;
  max-width: 960px;
  @media (max-width: ${sizes.tablet}px) {
    display: none;
  }
`

const tabBarTabs = ['STORIES', 'GUIDES', 'NEARBY', 'FROM US']

class Feed extends ContainerWithFeedList {
  static propTypes = {
    users: PropTypes.objectOf(PropTypes.object),
    signedUp: PropTypes.bool,
    userFeedCount: PropTypes.number,
    badgeUserFeedCount: PropTypes.number,
    nearbyFeedCount: PropTypes.number,
  }

  componentDidMount() {
    const { pagination } = this.state
    this.props.getStories(this.props.sessionUserId, pagination)
    this.setupSearchHelper()

    // first attempt may take 20-40 seconds, so grab loc as soon as possible
    this.getGeolocation()

    // holdover from past implemention, ensure safe removal of logic before deleting
    if (this.props.signedUp) this.props.signupReset()
  }

  componentDidUpdate(_, prevState) {
    if (
      prevState.latitude !== this.state.latitude
      && prevState.longitude !== this.state.longitude
      && this.state.latitude
      && this.state.longitude
    ) {
      this.searchNearbyStories()
    }
  }

  getFeedByType() {
    switch (this.state.activeTab) {
      case 'NEARBY':
        return this.props.nearbyFeedById || []
      case 'FROM US':
        return this.props.badgeUserFeedById || []
      case 'STORIES':
      default:
        return this.props.userFeedById || []
    }
  }

  getCountByType() {
    switch (this.state.activeTab) {
      case 'NEARBY':
        return this.props.nearbyFeedCount || 0
      case 'FROM US':
        return this.props.badgeUserFeedCount || 0
      case 'STORIES':
      default:
        return this.props.userFeedCount || 0
    }
  }

  render() {
    const { users, stories } = this.props
    const feedStories = this.getFeedByType().map(id => {
      return stories[id]
    })

    const { selectedFeedItems, fetchStatus } = this.getSelectedFeedItems()
    const isStory = this.state.activeTab !== 'GUIDES'

    return (
      <Wrapper>
        <FeedHeader
          stories={feedStories}
          users={users}
        />
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <ContentWrapper>
          <FeedText>MY FEED</FeedText>
          <StyledDivider />
          <FeedItemList
            getTabInfo={this.getTabInfo}
            activeTab={this.state.activeTab}
            feedItems={selectedFeedItems}
            feedItemCount={isStory ? this.getCountByType() : selectedFeedItems.length}
            fetching={fetchStatus.fetching}
          />
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  let {
    entities: stories,
    userFeedById,
    badgeUserFeedById,
    nearbyFeedById,
    userFeedCount,
    badgeUserFeedCount,
    nearbyFeedCount,
  } = state.entities.stories
  const guides = state.entities.guides.entities
  const guidesById = state.entities.guides.feedGuidesById || []

  return {
    sessionUserId: state.session.userId,
    userFeedById,
    nearbyFeedById,
    badgeUserFeedById,
    guidesById,
    stories,
    guides,
    users: state.entities.users.entities,
    userFeedCount,
    badgeUserFeedCount,
    nearbyFeedCount,
    signedUp: state.signup.signedUp,
    userStoriesFetchStatus: state.entities.stories.fetchStatus,
    draftsFetchStatus: state.storyCreate.fetchStatus,
    userBookmarksFetchStatus: state.entities.users.fetchStatus,
    guidesFetchStatus: state.entities.guides.fetchStatus,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStories: (sessionUserId, params) =>
      dispatch(StoryActions.feedRequest(sessionUserId, params)),
    getNearbyStories: nearbyStoryIds =>
      dispatch(StoryActions.nearbyFeedRequest(nearbyStoryIds)),
    getBadgeUserStories: () => dispatch(StoryActions.badgeUserFeedRequest()),
    getGuides: sessionUserId => dispatch(GuideActions.guideFeedRequest(sessionUserId)),
    signupReset: () => dispatch(SignUpActions.signupReset()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feed)
