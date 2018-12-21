import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Styles/SearchResultsScreenStyles'

import { View, ScrollView, Text} from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'
import {navToProfile} from '../Navigation/NavigationRouter'
import env from '../Config/Env'
// Search
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper'
// Locations
import RNGooglePlaces from 'react-native-google-places'

import FeedItemsOfType from '../Components/GuideStoriesOfType'
import Loader from '../Components/Loader'

import Colors from '../Shared/Themes/Colors'

const algoliasearch = algoliasearchModule(
  env.SEARCH_APP_NAME,
  env.SEARCH_API_KEY,
)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const GUIDE_INDEX = env.SEARCH_GUIDE_INDEX
const MAX_STORY_RESULTS = 64
const MAX_GUIDE_RESULTS = 20

class SearchResultsScreen extends Component {
  static propTypes = {
    location: PropTypes.object,
    userId: PropTypes.string,
  }

  state = {
    isFetchingResults: true,
    lastSearchResults: {
      stories: [],
      guides: [],
    },
  }

  typeLabels = {
    guides: 'Guides',
    stories: 'All Stories',
    see: 'Things to See',
    do: 'Things to Do',
    eat: 'Things to Eat',
    stay: 'Places to Stay',
  }

  async componentDidMount() {
    // location
    try {
      const { latitude, longitude } = await RNGooglePlaces.lookUpPlaceByID(
        this.props.location.placeID,
      )

      // guides
      this.guideHelper = AlgoliaSearchHelper(algoliasearch, GUIDE_INDEX)
      this.setupSearchListeners(this.guideHelper, 'guides')
      this.search(this.guideHelper, MAX_GUIDE_RESULTS, latitude, longitude)

      // stories
      this.storyHelper = AlgoliaSearchHelper(algoliasearch, STORY_INDEX)
      this.setupSearchListeners(this.storyHelper, 'stories')
      this.search(this.storyHelper, MAX_STORY_RESULTS, latitude, longitude)
    }
    catch (err) {
      console.error(err)
    }
  }

  setupSearchListeners = (helper, type) => {
    helper.on('result', res => {
      this.setState({
        isFetchingResults: false,
        lastSearchResults: {
          ...this.state.lastSearchResults,
          [type]: res.hits,
        },
      })
    })
  }

  search = (helper, hits, latitude, longitude) => {
    helper
      .setQuery('')
      .setQueryParameter('aroundLatLng', `${latitude}, ${longitude}`)
      .setQueryParameter('hitsPerPage', hits)
      .search()
  }

  _navToSeeAll = (type, feedItems) => {
    return () => NavActions.searchResultsSeeAll({
      feedItemType: type,
      typeLabels: this.typeLabels,
      feedItems,
      userId: this.props.userId,
      title: `${this.props.location.primaryText} - ${this.typeLabels[type]}`,
    })
  }

  _onPressAuthor = (authorId) => {
    const { userId } = this.props
    if (authorId === userId) navToProfile()
    else NavActions.readOnlyProfile({userId: authorId})
  }

  _shouldDisplaySection = items => !!items && !!items.length

  render() {
    const { isFetchingResults, lastSearchResults } = this.state
    return (
      <View style={styles.root}>
        {isFetchingResults ? (
          <Loader style={styles.loader} spinnerColor={Colors.blackoutTint} />
        ) : (
          (!!lastSearchResults.stories.length
            || !!lastSearchResults.guides.length)
            ? (
              <ScrollView style={styles.scrollView}>
                {Object.keys(this.typeLabels).map(type => {
                  const feedItems = (type === 'guides' || type === 'stories')
                    ? lastSearchResults[type]
                    : lastSearchResults.stories.filter(feedItem => feedItem.type === type)
                  if (!this._shouldDisplaySection(feedItems)) return null

                  return (
                    <FeedItemsOfType
                      key={`${type}-search-grid`}
                      type={type}
                      label={this.typeLabels[type].toUpperCase()}
                      onPressAll={this._navToSeeAll}
                      onPressAuthor={this._onPressAuthor}
                      isShowAll={false}
                      stories={feedItems}
                      authors={{}}
                    />
                  )
                })}
              </ScrollView>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  {'No results for this search'}
                </Text>
              </View>
            )
        )}
      </View>
    )
  }
}

export default SearchResultsScreen
