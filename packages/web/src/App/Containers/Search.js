import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import env from '../Config/Env'

import UserActions from '../Shared/Redux/Entities/Users'
import SearchResultsPeople from '../Components/SearchResultsPeople'
import SearchResultsStories from '../Components/SearchResultsStories'
import TabBar from '../Components/TabBar'
import {Row} from '../Components/FlexboxGrid'
//seach
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'

const Container = styled.div`
  margin-top: 65px;
`

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
  letter-spacing: .7px;
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
  letter-spacing: .7px;
`

const tabBarTabs = ['STORIES', 'PEOPLE']

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const USERS_INDEX = env.SEARCH_USERS_INDEX

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'STORIES',
      lastSearchResults: {},
      inputText: ''
    }
  }

  componentWillMount() {
    this.helper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.helper)
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  //loads user following if user log's in on the home page
  componentDidUpdate(prevProps){
    if(this.props.userId !== prevProps.userId){
      this.props.loadUserFollowing(this.props.userId)
    }
  }

  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        search: false,
        lastSearchResults: res
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

  inputFieldChange = (e) => {
    this.setState({inputText: e.target.value})
    this._changeQuery(e)
  }

  _changeQuery = (e) => {
    const helper = this.helper
    const q = e.target.value
    const hasSearchText = q.length > 0
    if(_.isString(q) && q.length === 0) {
      this.setState({
        lastSearchResults: {},
        searching: false,
        hasSearchText
      })
      return
    } else if (_.isString(q) && q.length < 3) {
      if(hasSearchText && !this.state.hasSearchText) {
        this.setState({
          lastSearchResults: {},
          hasSearchText
        })
      }
      return
    }

    _.debounce(() => {
      helper
        .setQuery(q)
        .search()
    }, 300)()
  }

  resetSearchText = () => {
    if(!this.state.lastSearchResults.hits) return
    else{
      this.setState({
        inputText: '', 
        lastSearchResults: {}
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

  _changeTab = (activeTab) => {
    this.changeIndex(this.getSearchIndex(activeTab))
    const textValue = this.state.inputText
    if(textValue && textValue.length >= 3) {
      this.setState({
        searching: true,
        activeTab,
        lastSearchResults: {}
      })
      this.helper.search()
    }
    else{
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
    this.props.reroute(`/profile/${userId}/view`)
  }

  _navToStory = (storyId) => {
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
        <SearchResultsStories
          storySearchResults={this.state.lastSearchResults}
          navToStory={this._navToStory}
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
    userId: state.session.userId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    followUser: (sessionUserID, userIdToFollow) => dispatch(UserActions.followUser(sessionUserID, userIdToFollow)),
    unfollowUser: (sessionUserID, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserID, userIdToUnfollow)),
    loadUserFollowing: (sessionUserID) => dispatch(UserActions.loadUserFollowing(sessionUserID)),
    reroute: (path) => dispatch(push(path))
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Search)
