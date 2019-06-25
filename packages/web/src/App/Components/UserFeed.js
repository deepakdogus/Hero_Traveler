import React, {Component} from 'react'
import styled from 'styled-components'
import queryString from 'query-string'

import TabBar from './TabBar'
import Footer from './Footer'
import FeedItemList from './FeedItemList'
import ContainerWithFeedList from '../Containers/ContainerWithFeedList';

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

export default class UserFeed extends ContainerWithFeedList {
  constructor(){
    super()
    this.state = {
      activeTab: 'STORIES',
    }
  }

  onClickTab = event => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab }, () => {
        this.getTabInfo()
      })
    }
  }

  getTabInfo = page => {
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    const userOrCategoryId = this.props.match.params.categoryId || this.props.match.params.userId
    switch (this.state.activeTab) {
      case 'DRAFTS':
        // used to purge pendingUpdates of removed stories
        this.props.getDeletedStories()
        return this.props.loadDrafts()
      case 'BOOKMARKS':
        return this.props.loadBookmarks(this.props.sessionUserId)
      case 'GUIDES':
        return (values.type === 'channel'
          ? (this.props.getUserGuides && this.props.getUserGuides(userOrCategoryId))
          : (this.props.getGuides && this.props.getGuides(userOrCategoryId)))
      case 'STORIES':
      default:
        values.type === 'channel'
          ? this.props.getUserStories(
              (userOrCategoryId),
              this.state.activeTab.toLowerCase(),
            )
          : this.props.getStories(
              this.props.sessionUserId,
            {
              perPage: itemsPerQuery,
              page,
            },
              this.state.activeTab,
            )
    }
  }

  render(){
    const { isUsersProfile, pendingDrafts } = this.props
    let {selectedFeedItems} = this.getSelectedFeedItems()
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
        { (!!selectedFeedItems.length)
        && <FeedItemListWrapper>
            <FeedItemList feedItems={selectedFeedItems} />
            <Footer />
           </FeedItemListWrapper>
        }
      </ListWrapper>
    )
  }
}
