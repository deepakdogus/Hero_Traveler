import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import Loader from './Loader'
import List from './List'
import ListItem from './ListItem'
import Avatar from './Avatar'

import getImageUrl from '../Shared/Lib/getImageUrl'
import styles from '../Containers/Styles/ExploreScreenStyles'
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

  renderLocationRow = location => {
    return (
      <ListItem
        onPress={this._navToSearchResults(location)}
        text={<Text style={styles.listItemText}>{location.primaryText}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderPlacesRow = story => {
    return (
      <ListItem
        onPress={this._navToStory(story)}
        text={<Text style={styles.listItemText}>{story.title}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderPeopleRow = user => {
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
          <Icon
            name="angle-right"
            color={Colors.whiteAlphaPt3}
            size={30}
          />
        }
      />
    )
  }

  renderRecentSearchesRow = item => {
    return (
      <ListItem
        onPress={this._navConditionally(item)}
        text={<Text style={styles.listItemText}>{item.title}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderSearchTitle = text => (
    <View style={styles.searchTitleWrapper}>
      <Text style={styles.searchTitleText}>{text}</Text>
    </View>
  )

  renderResultsSection = (title, items, renderFunc) => (
    <Fragment>
      {this.renderSearchTitle(title)}
      <List items={items} renderRow={renderFunc} />
    </Fragment>
  )

  renderNoResults = () => (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>{'No results'}</Text>
    </View>
  )

  render = () => {
    const {
      isSearching,
      selectedTabIndex,
      lastSearchResults,
      lastLocationPredictions,
      searchHistory,
      hasSearchText,
      query,
    } = this.props
    const searchHits = _.get(lastSearchResults, 'hits', []).slice(0, MAX_ITEMS)
    const locationHits = lastLocationPredictions || []

    const hasNoResults = !isSearching
      && !searchHits.length
      && !locationHits.length

    const showRecentPlacesSearches = hasNoResults
      && !!searchHistory.places.length
      && (!hasSearchText || query.length < 3)

    const showRecentPeopleSearches = hasNoResults
      && !!searchHistory.people.length
      && (!hasSearchText || query.length < 3)

    const showNoResults = hasNoResults && hasSearchText && query.length >= 3

    return (
      <View style={styles.scrollWrapper}>
        {isSearching && <Loader style={styles.searchLoader} />}
        {!isSearching && selectedTabIndex === 0 && (
          <ScrollView>
            {!!locationHits.length &&
              this.renderResultsSection(
                'LOCATIONS',
                lastLocationPredictions,
                this.renderLocationRow,
              )}
            {!!searchHits.length &&
              this.renderResultsSection(
                'STORIES',
                searchHits,
                this.renderPlacesRow,
              )}
            {showRecentPlacesSearches &&
              this.renderResultsSection(
                'RECENT SEARCHES',
                searchHistory.places,
                this.renderRecentSearchesRow,
              )}
            {!showRecentPlacesSearches && showNoResults && this.renderNoResults()}
          </ScrollView>
        )}
        {!isSearching && selectedTabIndex === 1 && (
          <ScrollView>
            {searchHits.length > 0 && (
              <List
                items={searchHits}
                renderRow={this.renderPeopleRow}
              />
            )}
            {showRecentPeopleSearches && (
              <List
                items={searchHistory.people}
                renderRow={this.renderPeopleRow}
              />
            )}
            {!showRecentPeopleSearches && showNoResults && this.renderNoResults()}
          </ScrollView>
        )}
      </View>
    )
  }
}

export default SearchList
