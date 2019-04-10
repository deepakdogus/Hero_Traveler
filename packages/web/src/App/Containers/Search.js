import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types'
import env from '../Config/Env'

import UserActions from '../Shared/Redux/Entities/Users'
import HistoryActions from '../Shared/Redux/HistoryRedux'
import { runIfAuthed } from '../Lib/authHelpers'
import { hasSecondaryText, formatSecondaryText } from '../Shared/Lib/locationHelpers'

import GoogleLocator from '../Components/GoogleLocator'
import SearchResultsPeople from '../Components/SearchResultsPeople'
import SearchAutocompleteList from '../Components/SearchAutocompleteList'
import TabBar from '../Components/TabBar'
import { Row } from '../Components/FlexboxGrid'

// search
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'
import { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete'
import { formatLocationWeb } from '../Shared/Lib/formatLocation'

const MAX_RESULTS = 10

const getCalculatedHeight = (responsive = false) => {
  const headerHeight = 65
  const searchBarHeight = responsive ? 67 : 122
  const tabBarHeight = responsive ? 50 : 73
  const extraMargins = 30
  return !responsive
    ? `calc(100vh - ${headerHeight + searchBarHeight + tabBarHeight + extraMargins}px)`
    : `calc(100vh - ${headerHeight + searchBarHeight + tabBarHeight}px)`
}

const Container = styled.div``

const HeaderInputContainer = styled(Row)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  padding: 0 30px;
  flex-wrap: nowrap;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0 15px;
  }
`

const HeaderInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  height: 120px;
  width: 80%;
  background-color: transparent;
  font-weight: 400;
  font-size: 30px;
  border: none;
  outline: none;
  letter-spacing: 0.2px;
  color: ${props => props.theme.Colors.signupGrey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 65px;
    font-size: 16px; /* <16px and iOS Safari will zoom on input (bad) */
  }
  &::placeholder {
    color: ${props => props.theme.Colors.signupGrey};
  }
  &::-moz-placeholder {
    color: ${props => props.theme.Colors.signupGrey};
  }
  &:-ms-input-placeholder {
    color: ${props => props.theme.Colors.signupGrey};
  }
  &:-moz-placeholder {
    color: ${props => props.theme.Colors.signupGrey};
  }
`

const ContentWrapper = styled.div``

const ScrollingListContainer = styled.div`
  height: ${getCalculatedHeight()};
  overflow-y: scroll;
  margin: 30px auto 0;
  max-width: 900px;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: ${getCalculatedHeight(true)};
    margin: 0 auto;
  }
`

export const ItemContainer = styled.div`
  max-width: 800px;
  margin: 0 50px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 12px 0;
    padding: 0 15px;
  }
`

export const ListTitle = styled.p`
  font-weight: 600;
  font-size: 20px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.7px;
`

const Text = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.redHighlights};
  text-align: 'right';
  margin: 0;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  line-height: 122px;
  letter-spacing: 0.2px;
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 15px;
    line-height: 66px;
  }
`

const tabBarTabs = ['PLACES', 'PEOPLE']

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const USERS_INDEX = env.SEARCH_USER_INDEX

class Search extends Component {
  static propTypes = {
    userId: PropTypes.string,
    loadUserFollowing: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    userFollowing: PropTypes.object,
    reroute: PropTypes.func,
    addRecentSearch: PropTypes.func,
    searchHistory: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'PLACES',
      algoliaResults: {},
      inputText: '',
    }
  }

  componentWillMount() {
    this.helper = algoliaSearchHelper(algoliasearch, USERS_INDEX)
    this.setupSearchListeners(this.helper)
    this.reinitializeQuery()
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  //loads user following if user log's in on the search page
  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.props.loadUserFollowing(this.props.userId)
    }
  }

  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        search: false,
        algoliaResults: res,
      })
    })
    helper.on('search', () => {
      this.setState({ searching: true })
    })
  }

  removeSearchListeners(helper) {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }

  inputFieldChange = inputText => {
    this.setState({ inputText })
    this.changeQuery(inputText)
  }

  changeQuery = queryText => {
    // changeQuery function only pertains to algolia searchs
    if (this.state.activeTab !== 'PEOPLE') return

    const hasSearchText = queryText.length > 0
    const isEmpty = _.isString(queryText) && queryText.length === 0
    const hasUnderThreeChars = _.isString(queryText) && queryText.length < 3

    // do not search when the search query is empty
    if (isEmpty)
      return this.setState({
        algoliaResults: {},
        searching: false,
        hasSearchText,
      })

    // do not search when under 3 characters query length
    if (hasUnderThreeChars) return

    _.debounce(() => {
      this.helper
        .setQuery(queryText)
        .setQueryParameter('hitsPerPage', MAX_RESULTS)
        .search()
    }, 300)()
  }

  resetSearchText = () =>
    this.setState({
      inputText: '',
      algoliaResults: {},
    })

  reinitializeQuery() {
    const { searchHistory } = this.props
    const lastSearchType = searchHistory.lastSearchType
    const inputText = _.get(searchHistory, `${lastSearchType}[0].searchText`)
    if (inputText) {
      const activeTab = searchHistory.lastSearchType === 'places' ? 'PLACES' : 'PEOPLE'
      this.setState(
        {
          inputText,
          activeTab,
        },
        () => this.changeQuery(inputText),
      )
    }
  }

  changeTab = activeTab => {
    const textValue = this.state.inputText
    if (activeTab === 'PEOPLE' && textValue && textValue.length >= 3) {
      this.setState({
        searching: true,
        activeTab,
        algoliaResults: {},
      })
      return this.helper.setQuery(textValue).search()
    }
    else {
      this.setState({ activeTab, algoliaResults: {} })
    }
  }

  onClickTab = event => {
    let tab = event.target.innerHTML
    this.changeTab(tab)
  }

  followUser = userIdToFollow => this.props.followUser(this.props.userId, userIdToFollow)

  unfollowUser = userIdToUnfollow => {
    this.props.unfollowUser(this.props.userId, userIdToUnfollow)
  }

  navToUserProfile = (userId, user) => {
    this.props.addRecentSearch({
      searchType: 'people',
      searchText: this.state.inputText,
      id: userId,
      ...user,
    })
    this.props.reroute(`/profile/${userId}/view`)
  }

  navToLocationResults = async ({ description, placeId, secondaryText }) => {
    const { reroute, addRecentSearch } = this.props
    try {
      let {
        name: title,
        country,
        latitude: lat,
        longitude: lng,
      } = await formatLocationWeb(
        description,
        placeId,
        geocodeByPlaceId,
        getLatLng,
      )

      if (lat && lng) {
        addRecentSearch({
          searchType: 'places',
          searchText: this.state.inputText,
          contentType: 'location',
          id: placeId,
          title,
          lat,
          lng,
          description,
          secondaryText,
        })
        reroute({
          pathname: `/results/${country}/${lat}/${lng}`,
          search: `?t=${title}${
            hasSecondaryText(secondaryText)
              ? `, ${formatSecondaryText(secondaryText)}`
              : ''
          }`,
        })
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  renderActiveTab = suggestions => {
    const { activeTab } = this.state
    return (
      <ScrollingListContainer>
        {activeTab === 'PLACES' && this.renderPlacesTab(suggestions)}
        {activeTab === 'PEOPLE' && this.renderPeopleTab()}
      </ScrollingListContainer>
    )
  }

  // @TODO: Add back 'LOCATIONS' label if you have >1 AutocompleteList on the page
  renderPlacesTab = suggestions => {
    const { inputText } = this.state
    const {
      searchHistory: { places },
    } = this.props
    if (!inputText) {
      return (
        <SearchAutocompleteList
          label="RECENT SEARCHES"
          autocompleteItems={places}
          navigate={this.navToLocationResults}
        />
      )
    }

    const formattedLocations = suggestions.map(suggestion => ({
      id: suggestion.id,
      placeId: suggestion.placeId,
      title: suggestion.formattedSuggestion.mainText,
      secondaryText: suggestion.formattedSuggestion.secondaryText,
      description: suggestion.description,
    }))
    if (formattedLocations.length)
      return (
        <SearchAutocompleteList
          // label="LOCATIONS"
          autocompleteItems={formattedLocations}
          navigate={this.navToLocationResults}
        />
      )
    return null
  }

  // @TODO: Add back 'PEOPLE' label if you have >1 AutocompleteList on the page
  renderPeopleTab = () => {
    const {
      searchHistory,
      searchHistory: { people },
      userFollowing,
      userId,
    } = this.props

    if (!this.state.inputText && people && !!people.length)
      return (
        <SearchResultsPeople
          label="RECENT SEARCHES"
          userSearchResults={searchHistory}
          userFollowing={userFollowing}
          userId={userId}
          followUser={this.followUser}
          unfollowUser={this.unfollowUser}
          navToUserProfile={this.navToUserProfile}
        />
      )

    return (
      <SearchResultsPeople
        // label="PEOPLE"
        userSearchResults={this.state.algoliaResults}
        userFollowing={userFollowing}
        userId={userId}
        followUser={this.followUser}
        unfollowUser={this.unfollowUser}
        navToUserProfile={this.navToUserProfile}
      />
    )
  }

  renderTab = suggestions => {
    return (
      <ContentWrapper>
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
          whiteBG
        />
        {this.renderActiveTab(suggestions)}
      </ContentWrapper>
    )
  }

  renderChildren = ({ getInputProps, suggestions }) => (
      <Container>
        <HeaderInputContainer between="xs">
          <HeaderInput
            {...getInputProps({
              placeholder: 'Type to search',
            })}
          />
          <Text onClick={this.resetSearchText}>{'Cancel'}</Text>
        </HeaderInputContainer>
        {this.renderTab(suggestions)}
      </Container>
    )

  /* The `react-places-autocomplete` package rerenders the child based on the search
   * input. We pass all search components through GoogleLocator so we don't have to
   * duplicate the Header Input; props to its children will only change as a result of
   * modified entry on the Places tab due to shouldFetchSuggestions conditional
   */
  render = () => {
    const { inputText, activeTab } = this.state
    return (
      <GoogleLocator
        value={inputText}
        onChange={this.inputFieldChange}
        shouldFetchSuggestions={activeTab === 'PLACES'}
        renderChildren={this.renderChildren}
        searchOptions={{ types: ['geocode'] }}
        isSearch
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    userFollowing: state.entities.users.userFollowingByUserIdAndId,
    userId: state.session.userId,
    searchHistory: state.history.searchHistory,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    followUser: (sessionUserId, userIdToFollow) =>
      dispatch(
        runIfAuthed(sessionUserId, UserActions.followUser, [
          sessionUserId,
          userIdToFollow,
        ]),
      ),
    unfollowUser: (sessionUserId, userIdToUnfollow) =>
      dispatch(
        runIfAuthed(sessionUserId, UserActions.unfollowUser, [
          sessionUserId,
          userIdToUnfollow,
        ]),
      ),
    loadUserFollowing: sessionUserID =>
      dispatch(UserActions.loadUserFollowing(sessionUserID)),
    reroute: path => dispatch(push(path)),
    addRecentSearch: search => dispatch(HistoryActions.addRecentSearch(search)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search)
