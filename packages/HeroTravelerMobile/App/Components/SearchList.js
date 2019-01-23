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
import Icon from 'react-native-vector-icons/FontAwesome'

import Loader from './Loader'
import ListItem from './ListItem'
import Avatar from './Avatar'

import getImageUrl from '../Shared/Lib/getImageUrl'
import styles from './Styles/SearchPlacesPeopleStyles'
import Colors from '../Shared/Themes/Colors'

const MAX_ITEMS = 5

class SearchList extends Component {
  static propTypes = {
    selectedTabIndex: PropTypes.number,
    lastSearchResults: PropTypes.object,
    lastLocationPredictions: PropTypes.array,
    isSearching: PropTypes.bool,
    userId: PropTypes.string,
    query: PropTypes.string,
    addRecentSearch: PropTypes.func,
    searchHistory: PropTypes.object,
    hasSearchText: PropTypes.bool,
  }

  _navToSearchResults = location => () => {
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
      },
      title: location.primaryText || location.title,
    })
  }

  _navToStory = story => () => {
    this.props.addRecentSearch({
      searchType: 'places',
      contentType: 'story',
      id: story.id,
      title: story.title,
    })
    NavActions.story({
      storyId: story._id || story.id,
      title: story.title,
    })
  }

  _navConditionally = item =>
    item.contentType === 'story'
      ? this._navToStory(item)
      : this._navToSearchResults(item)

  _navToUserProfile = user => () => {
    this.props.addRecentSearch({
      searchType: 'people',
      id: user._id,
      ...user,
    })
    if (user._id === this.props.userId) {
      NavActions.profile({ type: 'jump' })
    }
    else {
      NavActions.readOnlyProfile({
        userId: user._id,
      })
    }
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
        onPress={this._navToSearchResults(location)}
        text={<Text style={styles.listItemText}>{location.primaryText}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderPlacesRow = ({ item: place }) => {
    return (
      <ListItem
        onPress={this._navToStory(place)}
        text={<Text style={styles.listItemText}>{place.title}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderPeopleRow = ({ item: user }) => {
    return (
      <ListItem
        onPress={this._navToUserProfile(user)}
        leftElement={
          <Avatar
            avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
            iconColor={Colors.lightGreyAreas}
          />
        }
        text={<Text style={styles.listItemText}>{user.username}</Text>}
        rightElement={
          <Icon name="angle-right" color={Colors.whiteAlphaPt3} size={30} />
        }
      />
    )
  }

  //no results
  hasNoResults = () => {
    const {
      isSearching,
      lastSearchResults,
      lastLocationPredictions,
    } = this.props
    const searchHits = _.get(lastSearchResults, 'hits', []).slice(0, MAX_ITEMS)
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
    return (
      <ListItem
        onPress={this._navConditionally(item)}
        text={<Text style={styles.listItemText}>{item.title}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderRecentPeopleRow = ({ item }) => {
    if (!this.shouldDisplayRecentPeople()) return null
    return this.renderPeopleRow({ item })
  }

  render = () => {
    const {
      isSearching,
      selectedTabIndex,
      lastSearchResults,
      lastLocationPredictions,
      searchHistory,
    } = this.props
    const searchHits = _.get(lastSearchResults, 'hits', []).slice(0, MAX_ITEMS)

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
                title: 'STORIES',
                data: searchHits || [],
                renderItem: this.renderPlacesRow,
                keyExtractor: item => item.id,
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
                data: searchHits,
                renderItem: this.renderPeopleRow,
                keyExtractor: item => item.id,
              },
              {
                title: 'RECENT SEARCHES',
                data: searchHistory.people,
                renderItem: this.renderRecentPeopleRow,
                keyExtractor: item => item.id,
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
