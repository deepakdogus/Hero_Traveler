import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import PropTypes from 'prop-types'
import env from '../Config/Env'

import UserActions from '../Shared/Redux/Entities/Users'
import UXActions from '../Redux/UXRedux'
import SearchResultsPeople from '../Components/SearchResultsPeople'
import SearchResultsPlaces from '../Components/SearchResultsPlaces'
import TabBar from '../Components/TabBar'
import {Row} from '../Components/FlexboxGrid'
//seach
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'

const Container = styled.div``

const HeaderInputContainer = styled(Row)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  padding: 0 30px;
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

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
      activeTab: 'STORIES',
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

  inputFieldChange = (event) => {
    this.setState({inputText: event.target.value})
    this._changeQuery(event.target.value)
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
    return activeTab === 'STORIES' ? STORY_INDEX : USERS_INDEX
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
    const inputText = _.get(searchHistory, `${lastSearchType}[0]`)
    if (inputText) {
      const activeTab = searchHistory.lastSearchType === 'story' ? 'STORIES' : 'PEOPLE'
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

  _navToUserProfile = (userId) => {
    this.props.addRecentSearch('user', this.state.inputText, userId)
    this.props.reroute(`/profile/${userId}/view`)
  }

  _navToStory = (storyId) => {
    this.props.addRecentSearch('story', this.state.inputText, storyId)
    this.props.reroute(`/story/${storyId}`)
  }

  renderActiveTab = () => {
    if (this.state.activeTab === 'PEOPLE') {
      return (
        <SearchResultsPeople
          userSearchResults={this.state.lastSearchResults}
          userFollowing={this.props.userFollowing}
          userId={this.props.userId}
          followUser={this._followUser}
          unfollowUser={this._unfollowUser}
          navToUserProfile={this._navToUserProfile}
        />
      )
    }
    else {
      return (
        <SearchResultsPlaces
          storySearchResults={this.state.lastSearchResults}
          navToStory={this._navToStory}
          navToUserProfile={this._navToUserProfile}
        />
      )
    }
  }

  render() {
    return (
      <Container>
        <HeaderInputContainer between='xs'>
          <HeaderInput
            value={this.state.inputText}
            onChange={this.inputFieldChange}
            placeholder='Type to search' />
          <Text
            onClick={this.resetSearchText}
          >Cancel</Text>
        </HeaderInputContainer>
        <ContentWrapper>
          <TabBar
            tabs={tabBarTabs}
            activeTab={this.state.activeTab}
            onClickTab={this.onClickTab}
            whiteBG
          />
          {this.renderActiveTab()}
        </ContentWrapper>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userFollowing: state.entities.users.userFollowingByUserIdAndId,
    userId: state.session.userId,
    searchHistory: state.ux.searchHistory,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    followUser: (sessionUserID, userIdToFollow) => dispatch(UserActions.followUser(sessionUserID, userIdToFollow)),
    unfollowUser: (sessionUserID, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserID, userIdToUnfollow)),
    loadUserFollowing: (sessionUserID) => dispatch(UserActions.loadUserFollowing(sessionUserID)),
    reroute: (path) => dispatch(push(path)),
    addRecentSearch: (type, text, id) => dispatch(UXActions.addRecentSearch(type, text, id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
