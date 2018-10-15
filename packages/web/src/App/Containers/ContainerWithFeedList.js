import React from 'react'
import PropTypes from 'prop-types'

export default class ContainerWithFeedList extends React.Component {
  static propTypes = {
    sessionUserId: PropTypes.string,
    loadBookmarks: PropTypes.func,
    getGuides: PropTypes.func,
    getStories: PropTypes.func,
    draftsById: PropTypes.objectOf(PropTypes.object),
    userBookmarksById: PropTypes.objectOf(PropTypes.object),
    guidesById: PropTypes.objectOf(PropTypes.object),
    storiesById: PropTypes.objectOf(PropTypes.object),
    guides: PropTypes.object,
    stories: PropTypes.object,
  }

  state = { activeTab: 'STORIES'}

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab }, () => {
        this.getTabInfo(tab)
      })
    }
  }

  getTabInfo = (tab) => {
    switch (tab) {
      case 'DRAFTS':
        return // cached only so no need to fetch
      case 'BOOKMARKS':
        return this.props.loadBookmarks(this.props.sessionUserId)
      case 'GUIDES':
        return this.props.getGuides(this.props.sessionUserId)
      case 'STORIES':
      case 'ALL':
      case 'SEE':
      case 'DO':
      case 'EAT':
      case 'STAY':
      default:
        return this.props.getStories(this.props.sessionUserId, tab)
    }
  }

  getFeedItemsByIds(idList, type = 'stories') {
    return idList.map(id => {
      return this.props[type][id]
    })
  }

  getSelectedFeedItems = () => {
    const {
      userStoriesFetchStatus, storiesById,
      draftsFetchStatus, draftsById,
      userBookmarksFetchStatus, userBookmarksById,
      guidesFetchStatus, guidesById,
    } = this.props

    // will use fetchStatus to show loading/error
    switch(this.state.activeTab){
      case 'DRAFTS':
        return {
          fetchStatus: draftsFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(draftsById),
        }
      case 'BOOKMARKS':
        return {
          fetchStatus: userBookmarksFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(userBookmarksById),
        }
      case 'GUIDES':
        return {
          fetchStatus: guidesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(guidesById, 'guides'),
        }
      case 'STORIES':
      case 'ALL':
      case 'SEE':
      case 'DO':
      case 'EAT':
      case 'STAY':
      default:
        return {
          fetchStatus: userStoriesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(storiesById),
        }
    }
  }
}
