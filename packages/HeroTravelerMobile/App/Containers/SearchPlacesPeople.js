import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, TextInput, TouchableOpacity, Text, Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'

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
      lastPeopleSearchResults: null,
      lastLocationPredictions: null,
      selectedTabIndex: null,
      inputText: '',
    }
  }

  componentWillMount() {
    this.helper = AlgoliaSearchHelper(algoliasearch, USERS_INDEX)
    this.setupSearchListeners(this.helper)
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  // search
  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        searchingAlgolia: false,
        lastPeopleSearchResults: res,
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

  changeIndex(newIndex) {
    this.removeSearchListeners(this.helper)
    this.helper = this.helper.setIndex(newIndex)
    this.setupSearchListeners(this.helper)
    return this.helper
  }

  _changeQuery = e => {
    const inputText = e.nativeEvent.text
    const hasSearchText = inputText.length > 0
    const { selectedTabIndex } = this.state

    // if no tab is selected, select the Places tab and continue
    if (selectedTabIndex === null) {
      this.setState({
        selectedTabIndex: 0,
        hasSearchText,
        inputText,
      })
    }

    // do not search when the search query is empty
    if (_.isString(inputText) && inputText.length === 0) return this.setState({
      lastPeopleSearchResults: null,
      lastLocationPredictions: null,
      searchingAlgolia: false,
      hasSearchText,
    })

    // do not search when under 3 characters query length
    if (_.isString(inputText) && inputText.length < 3) {
      if (hasSearchText && !this.state.hasSearchText) {
        this.setState({ hasSearchText })
      }
      return
    }

    _.debounce(() => {
      // query Google PlacesAutocomplete API for Places
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

      // query Algolia for People
      if (selectedTabIndex === 1) this.helper.setQuery(inputText).search()
    }, 300)()
  }

  _changeTab = selectedTabIndex => {
    const textValue = this._searchInput._lastNativeText
    if (selectedTabIndex === 1 && textValue && textValue.length >= 3) {
      this.setState({
        searchingAlgolia: true,
        selectedTabIndex,
        lastPeopleSearchResults: null,
      })
      this.helper.search()
    }
    else {
      this.setState({ selectedTabIndex, lastPeopleSearchResults: null })
    }
  }

  _goToPlacesTab = () => this._changeTab(0)

  _goToPeopleTab = () => this._changeTab(1)

  _handleSelectCover = () => {
    NavActions.createQuickShare({

    })
  }

  setFocus = () => {
    if (this.state.selectedTabIndex === null)
      this.setState({ selectedTabIndex: 0 })
  }

  checkClearResults = text => {
    if (text.length <= 2) {
      this.setState({ lastPeopleSearchResults: null })
    }
  }

  resetSearchText = () => {
    this._searchInput.setNativeProps({ text: '' })
    this.setState({
      hasSearchText: false,
      lastPeopleSearchResults: null,
      lastLocationPredictions: null,
    })
  }

  onPressCancel = () => {
    this._searchInput.setNativeProps({ text: '' })
    this.setState({
      selectedTabIndex: null,
      lastPeopleSearchResults: null,
      lastLocationPredictions: null,
      hasSearchText: false,
    })
    Keyboard.dismiss()
  }

  onPressPostCard = () => {
    NavActions.mediaSelectorScreen({
      title: 'CREATE QUICKSHARE',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Next',
      onSelectMedia: this._handleSelectCover,
    })
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
      lastPeopleSearchResults,
      lastLocationPredictions,
      selectedTabIndex,
      hasSearchText,
      searchingGoogle,
      searchingAlgolia,
    } = this.state
    const showSearch = lastPeopleSearchResults
      || lastLocationPredictions
      || selectedTabIndex !== null
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
            <TouchableOpacity onPress={this.onPressPostCard}>
              <View style={styles.postCard}>
                <TabIcon
                  name="cameraDark"
                  defaultScale
                  style={{
                    image: styles.postCardIcon,
                  }}
                />
              </View>
            </TouchableOpacity>
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
              lastPeopleSearchResults={lastPeopleSearchResults}
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
