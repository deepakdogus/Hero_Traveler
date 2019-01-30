import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
// Search
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper'
// Locations
import RNGooglePlaces from 'react-native-google-places'

import env from '../Config/Env'
import Colors from '../Shared/Themes/Colors'
import styles from './Styles/SearchResultsScreenStyles'
import { navToProfile } from '../Navigation/NavigationRouter'
import FeedItemsOfType from '../Components/FeedItemsOfType'
import Loader from '../Components/Loader'

const algoliasearch = algoliasearchModule(
  env.SEARCH_APP_NAME,
  env.SEARCH_API_KEY,
)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const GUIDE_INDEX = env.SEARCH_GUIDE_INDEX
const MAX_STORY_RESULTS = 64
const MAX_GUIDE_RESULTS = 20
const MAX_RADIUS = 804672 // = 250 miles in meters
const METER_PRECISION = 1000 // 0-1000m, 1001-2000m, etc., distances ranked "equally near"

class SearchResultsScreen extends Component {
  static propTypes = {
    location: PropTypes.object,
    userId: PropTypes.string,
    addRecentSearch: PropTypes.func,
    historyData: PropTypes.object,
  }

  state = {
    isFetchingGuideResults: true,
    isFetchingStoryResults: true,
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
    try {
      const { historyData, addRecentSearch } = this.props

      // location
      const locationData = this._hasHistoryData()
        ? historyData
        : await this._getLocationDataFromGoogle()

      // guides
      this.guideHelper = AlgoliaSearchHelper(algoliasearch, GUIDE_INDEX, {
        disjunctiveFacets: ['locationInfo.country'],
      })
      this.setupSearchListeners(this.guideHelper, 'guides')
      this.search(this.guideHelper, MAX_GUIDE_RESULTS, locationData)

      // stories
      this.storyHelper = AlgoliaSearchHelper(algoliasearch, STORY_INDEX, {
        disjunctiveFacets: ['locationInfo.country'],
      })
      this.setupSearchListeners(this.storyHelper, 'stories')
      this.search(this.storyHelper, MAX_STORY_RESULTS, locationData)

      // add to search history
      addRecentSearch({
        ...historyData,
        ...locationData,
      })
    }
    catch (err) {
      console.error(err)
    }
  }

  _hasHistoryData = () => {
    const { latitude, longitude, country } = this.props.historyData
    if (!latitude || !longitude || !country) return false
    return true
  }

  _getLocationDataFromGoogle = async () => {
    const {
      latitude,
      longitude,
      addressComponents: { country },
    } = await RNGooglePlaces.lookUpPlaceByID(this.props.location.placeID)
    return { latitude, longitude, country }
  }

  setupSearchListeners = (helper, type) => {
    helper.on('result', res => {
      const lastSearchResults = {
        ...this.state.lastSearchResults,
        [type]: res.hits,
      }
      type === 'guides'
        ? this.setState({
            isFetchingGuideResults: false,
            lastSearchResults,
          })
        : this.setState({
            isFetchingStoryResults: false,
            lastSearchResults,
        })
    })
  }

  search = (helper, hitCount, { latitude, longitude, country }) => {
    helper.addDisjunctiveFacetRefinement(
      'locationInfo.country',
      `${country}`,
    )
    helper
    .setQuery('')
    .setQueryParameter('aroundLatLng', `${latitude}, ${longitude}`)
    .setQueryParameter('aroundRadius', MAX_RADIUS)
    .setQueryParameter('aroundPrecision', METER_PRECISION)
    .setQueryParameter('hitsPerPage', hitCount)
    .search()
  }

  _navToSeeAll = (type, feedItems) => {
    const { location, historyData, userId} = this.props
    const title = location.primaryText || historyData.title

    return () => NavActions.searchResultsSeeAll({
      feedItemType: type,
      typeLabels: this.typeLabels,
      feedItems,
      userId,
      title: `${title} - ${this.typeLabels[type]}`,
    })
  }

  _onPressAuthor = (authorId) => {
    const { userId } = this.props
    if (authorId === userId) navToProfile()
    else NavActions.readOnlyProfile({userId: authorId})
  }

  _shouldDisplaySection = items => !!items && !!items.length

  render() {
    const {
      isFetchingGuideResults,
      isFetchingStoryResults,
      lastSearchResults,
    } = this.state

    const isFetchingResults = isFetchingGuideResults || isFetchingStoryResults

    const hasResults = !!lastSearchResults.stories.length
      || !!lastSearchResults.guides.length

    return (
      <View style={styles.root}>
        {isFetchingResults && (
          <Loader style={styles.loader} spinnerColor={Colors.blackoutTint} />
        )}
        {!isFetchingResults && hasResults && (
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
                  onPressAll={this._navToSeeAll(type, feedItems)}
                  onPressAuthor={this._onPressAuthor}
                  isShowAll={false}
                  feedItems={feedItems}
                  isGuide={type === 'guides'}
                />
              )
            })}
          </ScrollView>
        )}
        {!isFetchingResults && !hasResults && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {'No results for this search'}
            </Text>
          </View>
        )}
      </View>
    )
  }
}

export default SearchResultsScreen
