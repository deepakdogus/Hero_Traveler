import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, TextInput, TouchableOpacity, Text, Keyboard } from 'react-native'
import PropTypes from 'prop-types'

// Search
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper'
// Locations
import RNGooglePlaces from 'react-native-google-places'

import env from '../Config/Env'

import HistoryActions from '../Shared/Redux/HistoryRedux'
import UserActions, { getFollowers } from '../Shared/Redux/Entities/Users'

import styles from '../Components/Styles/SearchPlacesPeopleStyles'
import { Colors } from '../Shared/Themes'

import SearchList from '../Components/SearchList'
import SearchTabBar from '../Components/SearchTabBar'
import TabIcon from '../Components/TabIcon'

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
    myFollowedUsers: PropTypes.array,
    unfollowUser: PropTypes.func,
    followUser: PropTypes.func,
    addRecentSearch: PropTypes.func,
    renderTabs: PropTypes.func,
    placeholder: PropTypes.string,
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

  // search
  hasDeletedStory(prevProps) {
    const oldLength = Object.keys(prevProps.stories).length
    const newLength = Object.keys(this.props.stories).length
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
        RNGooglePlaces.getAutocompletePredictions(inputText, {
          type: 'geocode',
        })
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
      hasSearchText: false,
    })
    Keyboard.dismiss()
  }

  setupInputRef = ref => (this._searchInput = ref)

  focusInput = () => this._searchInput.focus()

  render = () => {
    const {
      renderTabs,
      children,
      user,
      addRecentSearch,
      searchHistory,
      placeholder,
      followUser,
      unfollowUser,
      myFollowedUsers,
    } = this.props
    const {
      lastSearchResults,
      lastLocationPredictions,
      selectedTabIndex,
      hasSearchText,
      searchingGoogle,
      searchingAlgolia,
    } = this.state
    const showSearch
      = lastSearchResults || lastLocationPredictions || selectedTabIndex !== null
    // TODO: remove conditional navBarBorder when you want to display the tab bar;
    // uncomment the renderTab() line

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View
          style={[
            styles.fakeNavBar,
            renderTabs && !showSearch && styles.navBarBorder,
          ]}
        >
          <View style={styles.headerSearch}>
            <View style={styles.searchWrapper}>
              {!hasSearchText && (
                <TouchableOpacity
                  style={styles.searchIconPosition}
                  onPress={this.focusInput}
                >
                  <TabIcon
                    name="explore"
                    defaultScale
                    style={{
                      image: styles.searchIcon,
                    }}
                  />
                </TouchableOpacity>
              )}
              <TextInput
                ref={this.setupInputRef}
                style={[
                  styles.searchInput,
                  hasSearchText && styles.searchInputFlex,
                ]}
                placeholder={placeholder || `Places & People`}
                placeholderTextColor={Colors.grey}
                onFocus={this.setFocus}
                onChange={this._changeQuery}
                onChangeText={this.checkClearResults}
                returnKeyType="search"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[
                  styles.InputXPosition,
                  hasSearchText && styles.InputXAbsolutePosition,
                ]}
                onPress={hasSearchText ? this.resetSearchText : this.focusInput}
              >
                <TabIcon
                  name="closeDark"
                  style={{
                    view: [
                      styles.InputXView,
                      !hasSearchText && styles.InputXViewHidden,
                    ],
                    image: styles.InputXIcon,
                  }}
                />
              </TouchableOpacity>
            </View>
            {selectedTabIndex !== null && (
              <TouchableOpacity onPress={this.onPressCancel}>
                <View style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* uncomment when adding channels feature */}
        {/* {!showSearch && renderTabs && renderTabs()} */}
        {!showSearch && children}
        {showSearch && (
          <View style={styles.tabsViewContainer}>
            <SearchTabBar
              selectedTabIndex={selectedTabIndex}
              goToPlacesTab={this._goToPlacesTab}
              goToPeopleTab={this._goToPeopleTab}
            />
            <SearchList
              selectedTabIndex={selectedTabIndex}
              lastSearchResults={lastSearchResults}
              lastLocationPredictions={lastLocationPredictions}
              isSearching={searchingAlgolia || searchingGoogle}
              userId={user.id}
              query={this.helper.state.query}
              hasSearchText={hasSearchText}
              addRecentSearch={addRecentSearch}
              searchHistory={searchHistory}
              followUser={followUser}
              unfollowUser={unfollowUser}
              myFollowedUsers={myFollowedUsers}
            />
          </View>
        )}
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { users } = state.entities
  const userId = state.session.userId
  return {
    user: state.entities.users.entities[state.session.userId],
    stories: state.entities.stories.entities,
    searchHistory: state.history.searchHistory,
    myFollowedUsers: getFollowers(users, 'following', userId),
  }
}

const mapDispatchToProps = dispatch => ({
  addRecentSearch: search => dispatch(HistoryActions.addRecentSearch(search)),
  followUser: (sessionUserId, userIdToFollow) =>
    dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
  unfollowUser: (sessionUserId, userIdToUnfollow) =>
    dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchPlacesPeople)
