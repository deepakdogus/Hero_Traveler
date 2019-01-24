import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StoryActions, { getByChannel } from '../Shared/Redux/Entities/Stories'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import DiscoverActions from '../Shared/Redux/DiscoverRedux'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignupActions from '../Shared/Redux/SignupRedux'

import ContainerWithFeedList from './ContainerWithFeedList'
import CategoryHeader from '../Components/CategoryHeader'
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

class DiscoverChannel extends React.Component {
  static propTypes = {
    users: PropTypes.object,
    channelId: PropTypes.string,
    channel: PropTypes.object,
    loadChannels: PropTypes.func,
    loadChannelStories: PropTypes.func,
    followChannel: PropTypes.func,
    unfollowChannel: PropTypes.func,
    isFollowingChannel: PropTypes.bool,
  }

  state = { activeTab: 'STORIES' }

  componentWillMount() {
    const {channel, loadChannels} = this.props
    if (!channel) {
      loadChannels()
    }
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML.split('&amp;').join('&')
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab })
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
    return (
      <ContentWrapper>
        <CategoryHeader
          category={{
            title: _.get(channel, 'profile.fullName'),
            image: _.get(channel, 'channelImage'),
          }}
          followCategory={this._followCategory}
          unfollowCategory={this._unfollowCategory}
          isFollowingCategory={isFollowingChannel}
        />
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <FeedItemListWrapper>
          <FeedItemList
            feedItems={[]}
            activeTab={this.state.activeTab === 'GUIDES' ? 'GUIDES' : 'STORIES'} 
          />
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
  console.log('state', state)
  return {
    sessionUserId,
    channelId,
    channel: _.find(_.get(state, 'discover.channels.data', []), {id: channelId}),
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
      dispatch(StoryActions.fromChannelRequest(channelId))
    },
    loadChannels: () => dispatch(DiscoverActions.fetchChannels()),
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
)(DiscoverChannel)
