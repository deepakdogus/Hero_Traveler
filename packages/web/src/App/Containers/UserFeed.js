import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import PropTypes from 'prop-types'

import TabBar from '../Components/TabBar'
import Footer from '../Components/Footer'
import FeedItemList from '../Components/FeedItemList'
import HeadlineDivider from '../Components/HeadlineDivider'
import ContainerWithFeedList from './ContainerWithFeedList'

const tabBarTabs = ['STORIES', 'DRAFTS', 'BOOKMARKS', 'GUIDES']
const readOnlyTabBarTabs = ['STORIES', 'GUIDES']

const ListWrapper = styled.div`
  position: relative;
`

const FeedItemListWrapper = styled.div`
  margin: 50px 7% 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`
export const itemsPerQuery = 100

export default class extends ContainerWithFeedList {
  static propTypes = {
    getStories: PropTypes.func,
    isUsersProfile: PropTypes.bool,
    pendingDrafts: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      activeTab: 'STORIES',
    }
  }

  componentWillMount = () => {
    this.props.getStories()
  }

  onClickTab = event => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab }, () => {
        this.getTabInfo()
      })
    }
  }

  render() {
    const { isUsersProfile, pendingDrafts, user } = this.props
    const image = _.get(user, 'channelSponsorLogo.original.path')
    let { selectedFeedItems } = this.getSelectedFeedItems()
    if (this.state.activeTab === 'DRAFTS') {
      const selectedFeedItemsIds = selectedFeedItems.map(item => item.id)
      const filteredPendingDrafts = pendingDrafts.filter(draft => {
        return selectedFeedItemsIds.indexOf(draft.id) === -1
      })
      selectedFeedItems = [...filteredPendingDrafts, ...selectedFeedItems]
    }
    return (
      <ListWrapper>
        <TabBar
          tabs={isUsersProfile ? tabBarTabs : readOnlyTabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        {image && <HeadlineDivider img={image} />}
        <FeedItemListWrapper>
          <FeedItemList
            activeTab={this.state.activeTab}
            feedItems={selectedFeedItems}
          />
          <Footer />
        </FeedItemListWrapper>
      </ListWrapper>
    )
  }
}