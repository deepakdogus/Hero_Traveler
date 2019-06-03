import React from 'react'
import PropTypes from 'prop-types'
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'
import queryString from 'query-string'

import env from '../Config/Env'

import { getDistanceFromLatLonInKm } from '../Lib/locationHelpers'

export const itemsPerQuery = 100

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const MAX_STORY_RESULTS = 100
const ONE_HUNDRED_MILES = 160934 // 100 miles
const ONE_TENTH_MILE_IN_KM = 0.160934

export default class ContainerWithFeedList extends React.Component {
  static propTypes = {
    sessionUserId: PropTypes.string,
    getDeletedStories: PropTypes.func,
    loadDrafts: PropTypes.func,
    loadBookmarks: PropTypes.func,
    getGuides: PropTypes.func,
    getStories: PropTypes.func,
    getNearbyStories: PropTypes.func,
    getUserStories: PropTypes.func,
    getBadgeUserStories: PropTypes.func,
    draftsById: PropTypes.objectOf(PropTypes.object),
    userBookmarksById: PropTypes.objectOf(PropTypes.object),
    guidesById: PropTypes.objectOf(PropTypes.object),
    userFeedById: PropTypes.objectOf(PropTypes.object),
    nearbyFeedById: PropTypes.objectOf(PropTypes.object),
    badgeUserFeedById: PropTypes.objectOf(PropTypes.object),
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
    gettingLocation: true,
    latitude: null,
    longitude: null,
  }

  setupSearchHelper() {
    this.helper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.helper.on('result', res => {
      const nearbyStoryIds = res.hits.map(story => story.id)
      this.props.getNearbyStories(nearbyStoryIds)
    })
  }

  searchNearbyStories() {
    const { latitude, longitude } = this.state
    if ((latitude, longitude)) {
      this.helper
        .setQuery()
        .setQueryParameter('aroundLatLng', `${latitude}, ${longitude}`)
        .setQueryParameter('aroundRadius', ONE_HUNDRED_MILES)
        .setQueryParameter('hitsPerPage', MAX_STORY_RESULTS)
        .search()
    }
  }

  getGeolocation() {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      if (
        !this.state.latitude
        || !this.state.longitude
        || getDistanceFromLatLonInKm(
          latitude,
          longitude,
          this.state.latitude,
          this.state.longitude,
        ) > ONE_TENTH_MILE_IN_KM
      ) {
        this.setState({ latitude, longitude })
      }
    })
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
        return this.props.loadBookmarks(userOrCategoryId)
      case 'GUIDES':
        return this.props.getGuides(userOrCategoryId)
      case 'NEARBY':
        return this.getGeolocation()
      case 'FROM US':
        return this.props.getBadgeUserStories(userOrCategoryId)
      case 'STORIES':
      case 'ALL':
      case 'SEE':
      case 'DO':
      case 'EAT':
      case 'STAY':
      default:
        values.type === 'channel'
          ? this.props.getUserStories(
              (userOrCategoryId),
              this.state.activeTab.toLowerCase(),
            )
          : this.props.getStories(
            userOrCategoryId,
            {
              perPage: itemsPerQuery,
              page,
            },
              this.state.activeTab,
            )
    }
  }

  getFeedItemsByIds = (idList, type = 'stories') =>
    idList && this.props[type] ? idList.map(id => this.props[type][id]) : []

  getSelectedFeedItems = () => {
    const {
      userStoriesFetchStatus,
      userFeedById, // overloaded -- feed and profile
      nearbyFeedById,
      badgeUserFeedById,
      draftsFetchStatus,
      draftsById,
      userBookmarksFetchStatus,
      userBookmarksById,
      guidesFetchStatus,
      guidesById,
      storiesById, // for category screen
    } = this.props

    // will use fetchStatus to show loading/error
    // console.log(this.props, 'these are the props in the container with feedlist')
    // const queryReqest = this.props.location.search
    // const values = queryString.parse(queryReqest)
    // console.log(values, 'these are the values')
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
          selectedFeedItems: this.getFeedItemsByIds(nearbyFeedById),
        }
      case 'FROM US':
        return {
          fetchStatus: userStoriesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(badgeUserFeedById),
        }
      case 'STORIES':
        return {
          fetchStatus: userStoriesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(userFeedById),
        }
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
