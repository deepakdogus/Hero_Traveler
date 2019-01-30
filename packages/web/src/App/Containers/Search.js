import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import PropTypes from 'prop-types'
import env from '../Config/Env'

import UserActions from '../Shared/Redux/Entities/Users'
import HistoryActions from '../Shared/Redux/HistoryRedux'
import { runIfAuthed } from '../Lib/authHelpers'

import GoogleLocator from '../Components/GoogleLocator'
import SearchResultsPeople from '../Components/SearchResultsPeople'
import SearchAutocompleteList from '../Components/SearchAutocompleteList'
import TabBar from '../Components/TabBar'
import { Row } from '../Components/FlexboxGrid'

//seacrh
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { formatLocationWeb } from '../Shared/Lib/formatLocation'

const MAX_STORY_RESULTS = 10

const getCalculatedHeight = (responsive = false) => {
  const headerHeight = 65
  const searchBarHeight = 122
  const tabBarHeight = responsive ? 50 : 73
  const extraMargins = 40
  return !responsive
    ? `calc(100vh - ${
        headerHeight
        + searchBarHeight
        + tabBarHeight
        + extraMargins
      }px)`
    : `calc(100vh - ${searchBarHeight + tabBarHeight + extraMargins}px)`
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
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.signupGrey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 65px;
    font-size: 15px;
  }
  &::placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
  &::-moz-placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
  &:-ms-input-placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
  &:-moz-placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
`

const ContentWrapper = styled.div``

const ScrollingListContainer = styled.div`
  height: ${getCalculatedHeight()};
  overflow-y: scroll;
  margin: 30px auto 0;
  max-width: 800px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: ${getCalculatedHeight(true)}
  }
`

const ListTitle = styled.p`
  font-weight: 600;
  font-size: 20px;
  padding: 0 30px;
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
  letter-spacing: .2px;
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 15px;
    line-height: 66px;
  }
`

const tabBarTabs = ['PLACES', 'PEOPLE']

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
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
      lastSearchResults: {},
      inputText: '',
    }
  }

  componentWillMount() {
    this.helper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.helper)
    this.reinitializeQuery()
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  //loads user following if user log's in on the search page
  componentDidUpdate(prevProps){
    if(this.props.userId !== prevProps.userId){
      this.props.loadUserFollowing(this.props.userId)
    }
  }

  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        search: false,
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

  inputFieldChange = inputText => {
    this.setState({ inputText })
    this._changeQuery(inputText)
  }

  _changeQuery = (queryText) => {
    const helper = this.helper
    const hasSearchText = queryText.length > 0
    if (_.isString(queryText) && queryText.length === 0) {
      this.setState({
        lastSearchResults: {},
        searching: false,
        hasSearchText,
      })
      return
    }
    else if (_.isString(queryText) && queryText.length < 3) {
      if (hasSearchText && !this.state.hasSearchText) {
        this.setState({
          lastSearchResults: {},
          hasSearchText,
        })
      }
      return
    }

    _.debounce(() => {
      helper
        .setQuery(queryText)
        .setQueryParameter('hitsPerPage', MAX_STORY_RESULTS)
        .search()
    }, 300)()
  }

  resetSearchText = () => {
    if(!this.state.lastSearchResults.hits) return
    else{
      this.setState({
        inputText: '',
        lastSearchResults: {},
      })
    }
  }

  getSearchIndex(activeTab) {
    return activeTab === 'PLACES' ? STORY_INDEX : USERS_INDEX
  }

  changeIndex(newIndex) {
    this.removeSearchListeners(this.helper)
    this.helper = this.helper.setIndex(newIndex)
    this.setupSearchListeners(this.helper)
    return this.helper
  }

  reinitializeQuery() {
    const {searchHistory} = this.props
    const lastSearchType = searchHistory.lastSearchType
    const inputText = _.get(searchHistory, `${lastSearchType}[0].searchText`)
    if (inputText) {
      const activeTab = searchHistory.lastSearchType === 'places' ? 'PLACES' : 'PEOPLE'
      this.changeIndex(this.getSearchIndex(activeTab))
      this.setState({
        inputText,
        activeTab,
      }, () => this._changeQuery(inputText))
    }
  }

  _changeTab = (activeTab) => {
    this.changeIndex(this.getSearchIndex(activeTab))
    const textValue = this.state.inputText
    if (textValue && textValue.length >= 3) {
      this.setState({
        searching: true,
        activeTab,
        lastSearchResults: {},
      })
      this.helper.setQuery(textValue).search()
    }
    else {
      this.setState({activeTab, lastSearchResults: {}})
    }
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    this._changeTab(tab)
  }

  _followUser = (userIdToFollow) => {
    this.props.followUser(this.props.userId, userIdToFollow)
  }

  _unfollowUser = (userIdToUnfollow) => {
    this.props.unfollowUser(this.props.userId, userIdToUnfollow)
  }

  _navToUserProfile = (userId, user) => {
    this.props.addRecentSearch({
      searchType: 'people',
      searchText: this.state.inputText,
      id: userId,
      ...user,
    })
    this.props.reroute(`/profile/${userId}/view`)
  }

  _navToStory = ({ id, title }) => {
    this.props.addRecentSearch({
      searchType: 'places',
      searchText: this.state.inputText,
      contentType: 'story',
      id,
      title,
    })
    this.props.reroute(`/story/${id}`)
  }

  _navToLocationResults = async ({id, description }) => {
    const { reroute, addRecentSearch } = this.props
    let { name: title, country, latitude: lat, longitude: lng } = await formatLocationWeb(
      description,
      geocodeByAddress,
      getLatLng,
    )
    if (lat && lng) {
      addRecentSearch({
        searchType: 'places',
        searchText: this.state.inputText,
        contentType: 'location',
        id,
        title,
        lat,
        lng,
      })
      reroute({
        pathname: `/results/${country}/${lat}/${lng}`,
        search: `?t=${title}`,
      })
    }
  }

  _navConditionally = item => {
    item.contentType === 'story'
      ? this._navToStory(item)
      : this._navToLocationResults(item)
  }

  renderActiveTab = suggestions => {
    if (this.state.activeTab === 'PEOPLE') {
      return (
        <ScrollingListContainer>
          <SearchResultsPeople
            userSearchResults={this.state.lastSearchResults}
            userFollowing={this.props.userFollowing}
            userId={this.props.userId}
            followUser={this._followUser}
            unfollowUser={this._unfollowUser}
            navToUserProfile={this._navToUserProfile}
          />
        </ScrollingListContainer>
      )
    }
    else {
      const formattedLocations = suggestions.map(suggestion => ({
        id: suggestion.id,
        title: suggestion.formattedSuggestion.mainText,
        description: suggestion.description,
      }))
      return (
        <ScrollingListContainer>
          {!!formattedLocations.length && (
            <SearchAutocompleteList
              label='LOCATIONS'
              autocompleteItems={formattedLocations}
              navigate={this._navToLocationResults}
            />
          )}
          {this.state.lastSearchResults.hits
            && !!this.state.lastSearchResults.hits.length
            && (
              <SearchAutocompleteList
                label='STORIES'
                autocompleteItems={this.state.lastSearchResults.hits}
                navigate={this._navToStory}
              />
            )
          }
        </ScrollingListContainer>
      )
    }
  }

  renderRecentSearches = () => {
    const { activeTab } = this.state
    const { searchHistory, searchHistory: { people } } = this.props

    if (activeTab === 'PLACES') {
      return (
        <ScrollingListContainer>
          <SearchAutocompleteList
            label='RECENT SEARCHES'
            autocompleteItems={searchHistory.places}
            navigate = {this._navConditionally}
          />
        </ScrollingListContainer>
      )
    }

    // activeTab is 'PEOPLE'
    if (!people || !people.length) return null
    return (
      <ScrollingListContainer>
        <ListTitle>{'RECENT SEARCHES'}</ListTitle>
        <SearchResultsPeople
          userSearchResults={searchHistory}
          userFollowing={this.props.userFollowing}
          userId={this.props.userId}
          followUser={this._followUser}
          unfollowUser={this._unfollowUser}
          navToUserProfile={this._navToUserProfile}
        />
      </ScrollingListContainer>
    )
  }

  renderTab = suggestions => {
    const { inputText } = this.state
    return (
    <ContentWrapper>
      <TabBar
        tabs={tabBarTabs}
        activeTab={this.state.activeTab}
        onClickTab={this.onClickTab}
        whiteBG
      />
      {inputText
        ? this.renderActiveTab(suggestions, inputText)
        : this.renderRecentSearches()
      }
    </ContentWrapper>
    )
  }

  renderChildren = ({ getInputProps, suggestions }) => (
    <Container>
      <HeaderInputContainer between='xs'>
        <HeaderInput
          {...getInputProps({
            placeholder: 'Type to search',
          })}
        />
        <Text
          onClick={this.resetSearchText}
        >
          {'Cancel'}
        </Text>
      </HeaderInputContainer>
      {this.renderTab(suggestions)}
    </Container>
  )

  render = () => {
    const { inputText, activeTab } = this.state
    return(
      <GoogleLocator
        value={inputText}
        onChange={this.inputFieldChange}
        shouldFetchSuggestions={activeTab === 'PLACES'}
        renderChildren={this.renderChildren}
        isSearch
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userFollowing: state.entities.users.userFollowingByUserIdAndId,
    userId: state.session.userId,
    searchHistory: state.history.searchHistory,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    followUser: (sessionUserId, userIdToFollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.followUser, [sessionUserId, userIdToFollow])),
    unfollowUser: (sessionUserId, userIdToUnfollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.unfollowUser, [sessionUserId, userIdToUnfollow])),
    loadUserFollowing: (sessionUserID) => dispatch(UserActions.loadUserFollowing(sessionUserID)),
    reroute: (path) => dispatch(push(path)),
    addRecentSearch: search => dispatch(HistoryActions.addRecentSearch(search)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
