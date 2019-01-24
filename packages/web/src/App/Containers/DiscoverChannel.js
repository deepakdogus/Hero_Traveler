import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StoryActions, { getByChannel } from '../Shared/Redux/Entities/Stories'
import DiscoverActions from '../Shared/Redux/DiscoverRedux'
import GuideActions from '../Shared/Redux/Entities/Guides'
import UserActions from '../Shared/Redux/Entities/Users'

import ContainerWithFeedList from './ContainerWithFeedList'
import CategoryHeader from '../Components/CategoryHeader'
import TabBar from '../Components/TabBar'
import FeedItemList from '../Components/FeedItemList'
import Footer from '../Components/Footer'

import getImageUrl from '../Shared/Lib/getImageUrl'

const tabBarTabs = ['STORIES', 'GUIDES']

const ContentWrapper = styled.div``

const FeedItemListWrapper = styled.div`
  margin: 10px 7% 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const SponsoredBy = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  margin-top: 50px;
  color: #adadad;
`

const StyledImage = styled.img`
  height: 50px;
  margin: 5px;
`

const Divider = styled.hr`
  border-bottom: 2px solid black;
  width: 100%;
  max-width: 960px;
  margin: 0 auto 50px; 
`

class DiscoverChannel extends ContainerWithFeedList {
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
    const {channel, loadChannels, getStories, getGuides} = this.props
    if (!channel) {
      loadChannels()
    }
    getStories()
    getGuides()
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
    const {selectedFeedItems} = this.getSelectedFeedItems()
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
        <SponsoredBy>
          <span>Sponsored by </span>
            <a href={_.get(channel, 'sponsorLink')}>
              <StyledImage src={getImageUrl(_.get(channel, 'channelSponsorLogo'))} />
            </a>
        </SponsoredBy>
        
        <FeedItemListWrapper>
          <Divider />
          <FeedItemList
            feedItems={selectedFeedItems}
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
  if (sessionUserId && channelId){
    const myFollowedUsersObject = state.entities.users.userFollowingByUserIdAndId[sessionUserId]
    const myFollowedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined
    isFollowingChannel = _.includes(myFollowedUsers, channelId)
  }
  return {
    sessionUserId,
    channelId,
    channel: _.find(_.get(state, 'discover.channels.data', []), {id: channelId}),
    storiesById: getByChannel(state.entities.stories, channelId),
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    guidesById: _.get(state, `entities.guides.guideIdsByUserId[${channelId}]`, []),
    isFollowingChannel,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const channelId = ownProps.match.params.channelId
  return {
    getStories: () => {
      dispatch(StoryActions.fromChannelRequest(channelId))
    },
    loadChannels: () => dispatch(DiscoverActions.fetchChannels()),
    getGuides: () => dispatch(GuideActions.getChannelGuides(channelId)),
    followChannel: (sessionUserID, channelId) => dispatch(UserActions.followUser(sessionUserID, channelId)),
    unfollowChannel: (sessionUserID, channelId) => dispatch(UserActions.unfollowUser(sessionUserID, channelId)),
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscoverChannel)
