import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
// Search
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper'

import FeedItemsOfType from '../Components/FeedItemsOfType'
import Loader from '../Components/Loader'

import env from '../Config/Env'
import styles from './Styles/SearchResultsScreenStyles'
import Colors from '../Shared/Themes/Colors'
import formatLocation from '../Shared/Lib/formatLocation'
import { navToProfile } from '../Navigation/NavigationRouter'

const placeByIdUri = `https://maps.googleapis.com/maps/api/place/details/json?key=${
  env.GOOGLE_API_KEY
}&placeid=`

const placeByIdFields = `&fields=address_component,geometry,name`

const algoliasearch = algoliasearchModule(
  env.SEARCH_APP_NAME,
  env.SEARCH_API_KEY,
)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const GUIDE_INDEX = env.SEARCH_GUIDE_INDEX
const MAX_STORY_RESULTS = 64
const MAX_GUIDE_RESULTS = 20
const METER_PRECISION = 1000 // 0-1000m, 1001-2000m, etc., distances ranked "equally near"

class SearchResultsScreen extends Component {
  static propTypes = {
    location: PropTypes.object,
    userId: PropTypes.string,
    addRecentSearch: PropTypes.func,
    historyData: PropTypes.object,
    title: PropTypes.string,
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
      const locationData = this.hasHistoryData()
        ? historyData
        : await this.getLocationDataFromGoogle()

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

  componentWillUnmount () {
    // avoids not showing new results/showing deleted stories
    this.guideHelper.clearCache()
    this.storyHelper.clearCache()
  }

  hasHistoryData = () => {
    const { latitude, longitude, country } = this.props.historyData
    return latitude && longitude && country
  }

  getLocationDataFromGoogle = async () => {
    const response = await fetch(`${placeByIdUri}${this.props.location.placeID}${placeByIdFields}`)
    const data = await response.json()
    return formatLocation(data.result)
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
      .setQueryParameter('aroundPrecision', METER_PRECISION)
      .setQueryParameter('hitsPerPage', hitCount)
      .search()
  }

  navToSeeAll = (type, feedItems) => () => NavActions.searchResultsSeeAll({
    feedItemType: type,
    typeLabels: this.typeLabels,
    feedItems,
    userId: this.props.userId,
    title: `${this.props.title} - ${this.typeLabels[type]}`,
  })

  onPressAuthor = (authorId) => {
    const { userId } = this.props
    if (authorId === userId) navToProfile()
    else NavActions.readOnlyProfile({userId: authorId})
  }

  shouldDisplaySection = items => !!items && !!items.length

  renderFeedItemsOfType = () => {
    const { lastSearchResults } = this.state
    return Object.keys(this.typeLabels).map((type, idx) => {
      const feedItems = (type === 'guides' || type === 'stories')
        ? lastSearchResults[type]
        : lastSearchResults.stories.filter(feedItem => feedItem.type === type)
      if (!this.shouldDisplaySection(feedItems)) return null

      return (
        <FeedItemsOfType
          key={`${type}-search-grid`}
          type={type}
          label={this.typeLabels[type].toUpperCase()}
          onPressAll={this.navToSeeAll(type, feedItems)}
          onPressAuthor={this.onPressAuthor}
          isShowAll={false}
          showDivider={idx !== 0}
          feedItems={feedItems}
          isGuide={type === 'guides'}
        />
      )
    })
  }

  render() {
    const {
      isFetchingGuideResults,
      isFetchingStoryResults,
      lastSearchResults,
    } = this.state

    const isFetchingResults = isFetchingGuideResults || isFetchingStoryResults

    const hasResults = !!lastSearchResults.stories.length
      || !!lastSearchResults.guides.length

    const contentInset = { bottom: 25 }
    const spinnerColor = Colors.blackoutTint

    return (
      <View style={styles.root}>
        {isFetchingResults && (
          <Loader
            style={styles.loader}
            spinnerColor={spinnerColor}
          />
        )}
        {!isFetchingResults && hasResults && (
          <ScrollView
            style={styles.scrollView}
            contentInset={contentInset}
          >
            {this.renderFeedItemsOfType()}
            <View style={styles.spacer}/>
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
