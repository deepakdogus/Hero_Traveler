import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  SectionList,
  View,
  Text,
  Keyboard,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import styles from './Styles/SearchPlacesPeopleStyles'

import FollowFollowingRow from './FollowFollowingRow'
import Loader from './Loader'
import ListItem from './ListItem'

const MAX_ITEMS = 5

class SearchList extends Component {
  static propTypes = {
    selectedTabIndex: PropTypes.number,
    lastPeopleSearchResults: PropTypes.object,
    lastLocationPredictions: PropTypes.array,
    isSearching: PropTypes.bool,
    userId: PropTypes.string,
    query: PropTypes.string,
    addRecentSearch: PropTypes.func,
    searchHistory: PropTypes.object,
    hasSearchText: PropTypes.bool,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    myFollowedUsers: PropTypes.array,
  }

  navToSearchResults = location => () => {
    Keyboard.dismiss()
    NavActions.searchResults({
      location,
      userId: this.props.userId,
      addRecentSearch: this.props.addRecentSearch,
      historyData: {
        searchType: 'places',
        contentType: 'location',
        id: location.placeID || location.id,
        title: location.primaryText || location.title,
        latitude: location.latitude,
        longitude: location.longitude,
        country: location.country,
      },
      title: location.primaryText || location.title,
    })
  }

  addUserToSearchHistory = user => {
    this.props.addRecentSearch({
      searchType: 'people',
      id: user._id || user.id,
      ...user,
    })
  }

  // search results
  renderSearchTitle = ({ section: { title, data } }) =>
    (
      !title
      || !data
      || !data.length
      || (title === 'RECENT SEARCHES' && !this.shouldDisplayRecentPlaces())
    )
      ? null
      : (
        <View style={styles.searchTitleWrapper}>
          <Text style={styles.searchTitleText}>{title}</Text>
        </View>
      )

  renderLocationRow = ({ item: location }) => {
    return (
      <ListItem
        onPress={this.navToSearchResults(location)}
        text={(
          <Text style={styles.listItemText}>
            {location.primaryText || location.title}
          </Text>
        )}
        style={styles.searchRowItem}
      />
    )
  }

  renderPeopleRow = ({ item: user }) => {
    const { userId, followUser, unfollowUser } = this.props
    return (
      <FollowFollowingRow
        sessionUserId={userId}
        user={user}
        followUser={followUser}
        unfollowUser={unfollowUser}
        isFollowing={user.isFollowing}
        addUserToSearchHistory={this.addUserToSearchHistory}
        styledInset
      />
    )
  }

  userIsFollowed = userId => _.includes(this.props.myFollowedUsers, userId)

  //recent searches
  shouldDisplayRecent = (type) => {
    const {
      searchHistory,
      hasSearchText,
      query,
    } = this.props

    return this.hasNoResults()
      && !!searchHistory[type].length
      && (!hasSearchText || query.length < 3)
  }

  shouldDisplayRecentPlaces = () => this.shouldDisplayRecent('places')

  shouldDisplayRecentPeople = () => this.shouldDisplayRecent('people')

  renderNoRecentSearches = () => {
    return (
      <View style={styles.noResults}>
        <Text style={styles.noResultsText}>
          {'No recent searches yet. Search for something!'}
        </Text>
      </View>
    )
  }

  renderRecentSearchesRow = ({ item }) => {
    if (!this.shouldDisplayRecentPlaces()) return null
    return this.renderLocationRow({ item })
  }

  renderRecentPeopleRow = ({ item }) => {
    if (!this.shouldDisplayRecentPeople()) return null
    return this.renderPeopleRow({ item })
  }

  //no results
  hasNoResults = () => {
    const {
      isSearching,
      lastPeopleSearchResults,
      lastLocationPredictions,
    } = this.props
    const searchHits = _.get(lastPeopleSearchResults, 'hits', []).slice(0, MAX_ITEMS)
    const locationHits = lastLocationPredictions || []

    return !isSearching
      && !searchHits.length
      && !locationHits.length
  }

  renderNoResults = () => {
    const {
      hasSearchText,
      query,
    } = this.props
    if (!(this.hasNoResults() && hasSearchText && query.length >= 3)) return null
    return (
      <View style={styles.noResults}>
        <Text style={styles.noResultsText}>{'No results'}</Text>
      </View>
    )
  }

  render = () => {
    const {
      isSearching,
      selectedTabIndex,
      lastPeopleSearchResults,
      lastLocationPredictions,
      searchHistory,
    } = this.props
    const searchHits = _.get(lastPeopleSearchResults, 'hits', []).slice(0, MAX_ITEMS)

    return (
      <View style={styles.scrollWrapper}>
        {isSearching && <Loader style={styles.searchLoader} />}
        {!isSearching && selectedTabIndex === 0 && (
          <SectionList
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            renderSectionHeader={this.renderSearchTitle}
            sections={[
              {
                title: 'LOCATIONS',
                data: lastLocationPredictions || [],
                renderItem: this.renderLocationRow,
                keyExtractor: item => item.placeID,
              },
              {
                title: 'RECENT SEARCHES',
                data: searchHistory.places || [],
                renderItem: this.renderRecentSearchesRow,
                keyExtractor: item => item.id,
              },
            ]}
            ListFooterComponent={this.renderNoResults}
          />
        )}
        {!isSearching && selectedTabIndex === 1 && (
          <SectionList
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            renderSectionHeader={this.renderSearchTitle}
            sections={[
              {
                title: 'RESULTS',
                data: searchHits.map(user => ({
                  ...user,
                  id: user._id, // normalize `_id` from algolia to `id` for db
                  isFollowing: this.userIsFollowed(user._id),
                })),
                renderItem: this.renderPeopleRow,
                keyExtractor: item => item._id,
              },
              {
                title: 'RECENT SEARCHES',
                data: searchHistory.people.map(user => ({
                  ...user,
                  isFollowing: this.userIsFollowed(user.id),
                })),
                renderItem: this.renderRecentPeopleRow,
                keyExtractor: item => item._id,
                ListEmptyComponent: this.renderNoRecentSearches,
              },
            ]}
            ListFooterComponent={this.renderNoResults}
          />
        )}
      </View>
    )
  }
}

export default SearchList
