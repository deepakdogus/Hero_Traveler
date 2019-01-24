import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StoryActions, { getByChannel, getFetchStatus } from '../Shared/Redux/Entities/Stories'
import ChannelActions from '../Shared/Redux/Entities/Channel'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignupActions from '../Shared/Redux/SignupRedux'

import ContainerWithFeedList from './ContainerWithFeedList'
import ChannelHeader from '../Components/ChannelHeader'
import TabBar from '../Components/TabBar'
import FeedItemList from '../Components/FeedItemList'
import Footer from '../Components/Footer'

import { runIfAuthed } from '../Lib/authHelpers'

const tabBarTabs = ['STORIES', 'GUIDES']

const ContentWrapper = styled.div``

const FeedItemListWrapper = styled.div`
  margin: 50px 7% 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

class Channel extends ContainerWithFeedList {
  static propTypes = {
    users: PropTypes.object,
    channelId: PropTypes.string,
    channel: PropTypes.object,
    loadCategories: PropTypes.func,
    loadChannelStories: PropTypes.func,
    followChannel: PropTypes.func,
    unfollowChannel: PropTypes.func,
    isFollowingChannel: PropTypes.bool,
  }

  state = { activeTab: 'ALL' }

  componentDidMount() {
    const {channel, loadCategories} = this.props
    this.getTabInfo()
    if (!channel) loadCategories()
  }

  _followChannel = (channelId) => {
    this.props.followChannel(this.props.sessionUserId, channelId)
  }

  _unfollowChannel = (channelId) => {
    this.props.unfollowChannel(this.props.sessionUserId, channelId)
  }

  render() {
    const {
      channel,
      isFollowingChannel,
    } = this.props
    const {selectedFeedItems} = this.getSelectedFeedItems()

    return (
      <ContentWrapper>
        <ChannelHeader
          channel={channel}
          followChannel={this._followChannel}
          unfollowChannel={this._unfollowChannel}
          isFollowingChannel={isFollowingChannel}
        />
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <FeedItemListWrapper>
          <FeedItemList
            feedItems={selectedFeedItems}
            activeTab={this.state.activeTab === 'GUIDES' ? 'GUIDES' : 'STORIES'}/>
          <Footer />
        </FeedItemListWrapper>
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const channelId = ownProps.match.params.channelId
  const sessionUserId = state.session.userId
  let isFollowingChannel = false
  if (state.session.userId) {
    isFollowingChannel = _.includes(state.signup.selectedCategories, channelId)
  }

  return {
    sessionUserId,
    channelId,
    channel: state.entities.categories.entities[channelId],
    fetchStatus: getFetchStatus(state.entities.stories, channelId),
    storiesById: getByChannel(state.entities.stories, channelId),
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    guidesById: _.get(state, `entities.guides.guideIdsByChannelId[${channelId}]`, []),
    isFollowingChannel,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const channelId = ownProps.match.params.channelId
  return {
    getStories: (_ignore, storyType) => {
      storyType = storyType.toLowerCase()
      if (storyType === 'all') storyType = null
      dispatch(StoryActions.fromChannelRequest(channelId, storyType))
    },
    loadCategories: () => dispatch(ChannelActions.loadCategoriesRequest()),
    getGuides: () => dispatch(GuideActions.getChannelGuides(channelId)),
    followChannel: (sessionUserId, channelId) =>
      dispatch(runIfAuthed(sessionUserId, SignupActions.signupFollowChannel, [channelId])),
    unfollowChannel: (sessionUserId, channelId) =>
      dispatch(runIfAuthed(sessionUserId, SignupActions.signupUnfollowChannel, [channelId])),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Channel)
