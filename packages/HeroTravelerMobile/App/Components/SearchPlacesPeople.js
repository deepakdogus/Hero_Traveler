import _ from 'lodash'
import React, { Component } from 'react'
import { View, TextInput, TouchableOpacity, Text} from 'react-native'
import PropTypes from 'prop-types'

// Search
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper'
// Locations
import RNGooglePlaces from 'react-native-google-places'

import env from '../Config/Env'

import styles from './Styles/SearchPlacesPeopleStyles'
import { Colors } from '../Shared/Themes'

import SearchList from './SearchList'
import SearchTabBar from './SearchTabBar'
import TabIcon from './TabIcon'

const algoliasearch = algoliasearchModule(
  env.SEARCH_APP_NAME,
  env.SEARCH_API_KEY,
)

const STORY_INDEX = env.SEARCH_STORY_INDEX
const USERS_INDEX = env.SEARCH_USER_INDEX

class SearchPlacesPeople extends Component {
  static propTypes = {
    user: PropTypes.object,
    stories: PropTypes.object,
    searchHistory: PropTypes.object,
    addRecentSearch: PropTypes.func,
    renderTabs: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
    const { selectedTabIndex, lastSearchResults } = this.state
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
          this.setState({ lastSearchResults })
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
        searchingAlgolia: false,
        lastSearchResults: res,
      })
    })
    helper.on('search', () => {
      this.setState({ searchingAlgolia: true })
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

  _changeQuery = e => {
    const helper = this.helper
    const inputText = e.nativeEvent.text
    const hasSearchText = inputText.length > 0
    const { selectedTabIndex } = this.state
    if (selectedTabIndex === null) {
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
        searchingAlgolia: false,
        hasSearchText,
      })
      return
    }

    if (_.isString(inputText) && inputText.length < 3) {
      if (hasSearchText && !this.state.hasSearchText) {
        this.setState({ hasSearchText })
      }
      return
    }

    _.debounce(() => {
      helper.setQuery(inputText).search()

      if (selectedTabIndex === 0) {
        this.setState({ searchingGoogle: true })
        RNGooglePlaces.getAutocompletePredictions(inputText)
          .then(predictions =>
            this.setState({
              searchingGoogle: false,
              lastLocationPredictions: predictions,
            }),
          )
          .catch(() => this.setState({ searchingGoogle: false }))
      }
    }, 300)()
  }

  _changeTab = selectedTabIndex => {
    this.changeIndex(this.getSearchIndex(selectedTabIndex))
    const textValue = this._searchInput._lastNativeText
    if (textValue && textValue.length >= 3) {
      this.setState({
        searchingAlgolia: true,
        selectedTabIndex,
        lastSearchResults: null,
      })
      this.helper.search()
    }
    else {
      this.setState({ selectedTabIndex, lastSearchResults: null })
    }
  }

  _goToPlacesTab = () => this._changeTab(0)

  _goToPeopleTab = () => this._changeTab(1)

  setFocus = () => {
    if (this.state.selectedTabIndex === null)
      this.setState({ selectedTabIndex: 0 })
  }

  checkClearResults = text => {
    if (text.length <= 2) {
      this.setState({ lastSearchResults: null })
    }
  }

  resetSearchText = () => {
    this._searchInput.setNativeProps({ text: '' })
    this.setState({
      hasSearchText: false,
      lastSearchResults: null,
      lastLocationPredictions: null,
    })
  }

  onPressCancel = () => {
    this._searchInput.setNativeProps({ text: '' })
    this.setState({
      selectedTabIndex: null,
      lastSearchResults: null,
      lastLocationPredictions: null,
    })
  }

  setupInputRef = ref => (this._searchInput = ref)

  render = () => {
    const {
      renderTabs,
      children,
      user,
      addRecentSearch,
      searchHistory,
    } = this.props
    const showSearch
      = this.state.lastSearchResults
      || this.state.lastLocationPredictions
      || this.state.selectedTabIndex !== null

    // TODO: remove conditional navBarBorder when you want to display the tab bar;
    // uncomment the renderTab() line

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={[styles.fakeNavBar, renderTabs && styles.navBarBorder]}>
          <View style={styles.headerSearch}>
            <View style={styles.searchWrapper}>
              <TextInput
                ref={this.setupInputRef}
                style={styles.searchInput}
                placeholder="Places &amp; People"
                placeholderTextColor={Colors.grey}
                onFocus={this.setFocus}
                onChange={this._changeQuery}
                onChangeText={this.checkClearResults}
                returnKeyType="search"
                autoCorrect={false}
              />
              {this.state.hasSearchText && (
                <TouchableOpacity
                  style={styles.InputXPosition}
                  onPress={this.resetSearchText}
                >
                  <TabIcon
                    name="closeDark"
                    style={{
                      view: styles.InputXView,
                      image: styles.InputXIcon,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
            {this.state.selectedTabIndex !== null && (
              <TouchableOpacity onPress={this.onPressCancel}>
                <View style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* {!showSearch && renderTabs && renderTabs()} */}
        {!showSearch && children}
        {showSearch && (
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
              isSearching={
                this.state.searchingAlgolia || this.state.searchingGoogle
              }
              userId={user.id}
              query={this.helper.state.query}
              hasSearchText={this.state.hasSearchText}
              addRecentSearch={addRecentSearch}
              searchHistory={searchHistory}
            />
          </View>
        )}
      </View>
    )
  }
}

export default SearchPlacesPeople
