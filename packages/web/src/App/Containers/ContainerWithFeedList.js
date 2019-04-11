import React from 'react'
import PropTypes from 'prop-types'
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'

import env from '../Config/Env'

export const itemsPerQuery = 100

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const MAX_STORY_RESULTS = 100
const ONE_HUNDRED_MILES = 160934 // 100 miles

export default class ContainerWithFeedList extends React.Component {
  static propTypes = {
    sessionUserId: PropTypes.string,
    getDeletedStories: PropTypes.func,
    loadDrafts: PropTypes.func,
    loadBookmarks: PropTypes.func,
    getGuides: PropTypes.func,
    getStories: PropTypes.func,
    getNearbyStories: PropTypes.func,
    draftsById: PropTypes.objectOf(PropTypes.object),
    userBookmarksById: PropTypes.objectOf(PropTypes.object),
    guidesById: PropTypes.objectOf(PropTypes.object),
    storiesById: PropTypes.objectOf(PropTypes.object),
    guides: PropTypes.object,
    stories: PropTypes.object,
    userStoriesFetchStatus: PropTypes.object,
    draftsFetchStatus: PropTypes.object,
    userBookmarksFetchStatus: PropTypes.object,
    guidesFetchStatus: PropTypes.object,
  }

  state = {
    activeTab: 'STORIES',
    searchResults: [],
  }

  setupSearchHelper() {
    this.helper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.helper.on('result', res => {
      this.setState({
        searching: false,
        searchResults: res.hits.map(story => story.id),
      })
    })
    this.helper.on('search', () => {
      this.setState({ searching: true })
    })
  }

  searchNearbyStories({ latitude, longitude }) {
    this.helper
      .setQuery()
      .setQueryParameter('aroundLatLng', `${latitude}, ${longitude}`)
      .setQueryParameter('aroundRadius', ONE_HUNDRED_MILES)
      .setQueryParameter('hitsPerPage', MAX_STORY_RESULTS)
      .search()
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
    switch (this.state.activeTab) {
    case 'DRAFTS':
        // used to purge pendingUpdates of removed stories
      this.props.getDeletedStories()
      return this.props.loadDrafts()
    case 'BOOKMARKS':
      return this.props.loadBookmarks(this.props.sessionUserId)
    case 'GUIDES':
      return this.props.getGuides(this.props.sessionUserId)
    case 'NEARBY':
      return navigator.geolocation.getCurrentPosition(
          ({ coords }) => this.searchNearbyStories(coords),
          error => console.error(error),
        )
    case 'STORIES':
    case 'ALL':
    case 'SEE':
    case 'DO':
    case 'EAT':
    case 'STAY':
    default:
      return this.props.getStories(
        this.props.sessionUserId,
        this.state.activeTab,
        {
          perPage: itemsPerQuery,
          page,
        },
      )
    }
  }

  getFeedItemsByIds(idList, type = 'stories') {
    return idList.map(id => {
      return this.props[type][id]
    })
  }

  getSelectedFeedItems = () => {
    const {
      userStoriesFetchStatus,
      storiesById,
      draftsFetchStatus,
      draftsById,
      userBookmarksFetchStatus,
      userBookmarksById,
      guidesFetchStatus,
      guidesById,
    } = this.props

    // will use fetchStatus to show loading/error
    switch (this.state.activeTab) {
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
    case 'NEARBY':
      return {
        fetchStatus: userStoriesFetchStatus,
        selectedFeedItems: this.getFeedItemsByIds(this.state.searchResults),
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
