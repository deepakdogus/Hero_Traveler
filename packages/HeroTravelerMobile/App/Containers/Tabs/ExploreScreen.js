import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import env from '../../Config/Env'
// Search
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper'
// Locations
import RNGooglePlaces from 'react-native-google-places'

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import HistoryActions from '../../Shared/Redux/HistoryRedux'

import Loader from '../../Components/Loader'
import ExploreGrid from '../../Components/ExploreGrid'
import styles, { CategoryFeedNavActionStyles } from '../Styles/ExploreScreenStyles'
import TabIcon from '../../Components/TabIcon'

import SearchList from '../../Components/SearchList'
import SearchTabBar from '../../Components/SearchTabBar'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const USERS_INDEX = env.SEARCH_USER_INDEX

class ExploreScreen extends Component {
  static propTypes = {
    stories: PropTypes.object,
    loadCategories: PropTypes.func,
    categories: PropTypes.object,
    categoriesFetchStatus: PropTypes.object,
    user: PropTypes.object,
    addRecentSearch: PropTypes.func,
    searchHistory: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      lastSearchResults: null,
      lastLocationPredictions: null,
      selectedTabIndex: null,
      inputText: '',
    }
  }

  componentWillMount() {
    this.helper = AlgoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.helper)
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  // after we delete a story we need to make sure we purge that story
  // from the story's hits
  componentWillReceiveProps(nextProps) {
    const oldStories = this.props.stories
    const {selectedTabIndex, lastSearchResults} = this.state
    const hits = lastSearchResults ? lastSearchResults.hits : []
    if (
      selectedTabIndex === 0
      && hits.length
      && this.hasDeletedStory(nextProps)
    ) {
      for (let key in oldStories) {
        if (!nextProps.stories[key]) {
          lastSearchResults.hits = hits.filter(hit => {
            return key !== hit._id
          })
          this.setState({lastSearchResults})
        }
      }
    }
  }

  // search

  hasDeletedStory(nextProps) {
    const oldLength = Object.keys(this.props.stories).length
    const newLength = Object.keys(nextProps.stories).length
    return oldLength - newLength === 1
  }

  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        searching: false,
        lastSearchResults: res,
      })
    })
    helper.on('search', () => {
      this.setState({searching: true})
    })
  }

  removeSearchListeners(helper) {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }

  getSearchIndex(selectedTabIndex) {
    return selectedTabIndex === 0 ? STORY_INDEX : USERS_INDEX
  }

  changeIndex(newIndex) {
    this.removeSearchListeners(this.helper)
    this.helper = this.helper.setIndex(newIndex)
    this.setupSearchListeners(this.helper)
    return this.helper
  }

  _changeQuery = (e) => {
    const helper = this.helper
    const inputText = e.nativeEvent.text
    const hasSearchText = inputText.length > 0
    if (this.state.selectedTabIndex === null) {
      this.setState({
        selectedTabIndex: 0,
        hasSearchText,
        inputText,
      })
    }

    if (_.isString(inputText) && inputText.length === 0) {
      this.setState({
        lastSearchResults: null,
        lastLocationPredictions: null,
        searching: false,
        hasSearchText,
      })
      return
    }
    else if (_.isString(inputText) && inputText.length < 3) {
      if (hasSearchText && !this.state.hasSearchText) {
        this.setState({hasSearchText})
      }
      return
    }

    _.debounce(() => {
      helper
        .setQuery(inputText)
        .search()

      RNGooglePlaces.getAutocompletePredictions(inputText)
        .then((predictions) => this.setState({
          searchingLocation: false,
          lastLocationPredictions: predictions,
        }))
        .catch(() => this.setState({searchingLocation: false}))
    }, 300)()
  }

  componentDidMount() {
    this.props.loadCategories()
  }

  _changeTab = (selectedTabIndex) => {
    this.changeIndex(this.getSearchIndex(selectedTabIndex))
    const textValue = this._searchInput._lastNativeText
    if (textValue && textValue.length >= 3) {
      this.setState({
        searching: true,
        selectedTabIndex,
        lastSearchResults: null,
      })
      this.helper.search()
    }
    else {
      this.setState({selectedTabIndex, lastSearchResults: null})
    }
  }

  _goToPlacesTab = () => this._changeTab(0)

  _goToPeopleTab = () => this._changeTab(1)

  setFocus = () => {
    if (this.state.selectedTabIndex === null) this.setState({selectedTabIndex: 0})
  }

  checkClearResults = (text) => {
    if (text.length <= 2) {
      this.setState({lastSearchResults: null})
    }
  }

  resetSearchText = () => {
    this._searchInput.setNativeProps({text: ''})
    this.setState({
      hasSearchText: false,
      lastSearchResults: null,
      lastLocationPredictions: null,
    })
  }

  onPressCancel = () => {
    this._searchInput.setNativeProps({text: ''})
    this.setState({
      selectedTabIndex: null,
      lastSearchResults: null,
      lastLocationPredictions: null,
   })
  }

  // explore
  _navToCategoryFeed = category => {
    NavActions.explore_categoryFeed({
      categoryId: category.id,
      title: category.title,
      leftButtonIconStyle: CategoryFeedNavActionStyles.leftButtonIconStyle,
      navigationBarStyle: CategoryFeedNavActionStyles.navigationBarStyle,
    })
  }

  setupInputRef= ref => this._searchInput = ref

  render () {
    const {categories = {}, categoriesFetchStatus} = this.props
    let content

    const showSearch =
      this.state.lastSearchResults
      || this.state.lastLocationPredictions
      || this.state.selectedTabIndex !== null
    const categoriesArray = _.values(categories)

    if (categoriesFetchStatus.fetching && !categoriesArray.length) {
      content = (
        <Loader style={styles.loader} />
      )
    }
    else if (showSearch) {
      content = (
        <View style={styles.tabsViewContainer}>
          <SearchTabBar
            selectedTabIndex={this.state.selectedTabIndex}
            goToPlacesTab={this._goToPlacesTab}
            goToPeopleTab={this._goToPeopleTab}
          />
          <SearchList
            selectedTabIndex={this.state.selectedTabIndex}
            lastSearchResults={this.state.lastSearchResults}
            lastLocationPredictions={this.state.lastLocationPredictions}
            isSearching={this.state.searching}
            isSearchingLocation={this.state.searchingLocation}
            userId={this.props.user.id}
            query={this.helper.state.query}
            addRecentSearch={this.props.addRecentSearch}
            searchHistory={this.props.searchHistory}
          />
        </View>
      )
    }
    else {
      content = (
        <ExploreGrid
          onPress={this._navToCategoryFeed}
          categories={categoriesArray}
        />
      )
    }

    return (
      <ScrollView style={[
        styles.containerWithTabbar,
        styles.root,
      ]}>
        <View style={styles.headerSearch}>
          <View style={styles.searchWrapper}>
            <TextInput
              ref={this.setupInputRef}
              style={styles.searchInput}
              placeholder='Search'
              placeholderTextColor='#757575'
              onFocus={this.setFocus}
              onChange={this._changeQuery}
              onChangeText={this.checkClearResults}
              returnKeyType='search'
            />
            { this.state.hasSearchText &&
            <TouchableOpacity
              style={styles.InputXPosition}
              onPress={this.resetSearchText}
            >
              <TabIcon
                name='closeDark'
                style={{
                  view: styles.InputXView,
                  image: styles.InputXIcon,
                }}
              />
            </TouchableOpacity>
            }
          </View>
          {this.state.selectedTabIndex !== null &&
            <TouchableOpacity onPress={this.onPressCancel}>
              <View style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          }
        </View>
        {!showSearch &&
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>EXPLORE</Text>
          </View>
        }
        {content}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
    error: categoriesError,
  } = state.entities.categories

  return {
    user: state.entities.users.entities[state.session.userId],
    stories: state.entities.stories.entities,
    categories,
    categoriesFetchStatus,
    error: categoriesError,
    searchHistory: state.history.searchHistory,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    addRecentSearch: search => dispatch(HistoryActions.addRecentSearch(search)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
