import React, { Component } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {connect} from 'react-redux'
import algoliasearchModule from 'algoliasearch'
import AlgoliaSearchHelper from 'algoliasearch-helper'

import SearchResultsPeople from '../Components/SearchResultsPeople'
import SearchResultsStories from '../Components/SearchResultsStories'
import TabBar from '../Components/TabBar'
import {Row} from '../Components/FlexboxGrid'
import CategoryActions from '../Shared/Redux/Entities/Categories'

import {feedExample} from './Feed_TEST_DATA'
import env from '../Config/Env'
const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)

const STORY_INDEX = env.SEARCH_STORY_INDEX
const USERS_INDEX = env.SEARCH_USER_INDEX

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

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastSearchResults: null,
      activeTab: 'STORIES'
    }
    this.onClickTab = this.onClickTab.bind(this)
  }

  componentWillMount(){
    this.helper = AlgoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.helper)
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
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

  onClickTab = (event) => {
    let tab = event.target.innerHTML
      if (this.state.activeTab !== tab) {
        this.setState({ activeTab: tab })
        this.changeIndex(tab === 'STORIES'? STORY_INDEX: USERS_INDEX)
    }
    const textValue = this.refs.outterHeaderInput.refs.innerHeaderInput.value;
    if (textValue && textValue.length >= 3) {
      this.setState({
        searching: true,
        lastSearchResults: null,
      })
      this.helper.search()
    }
    else {
      this.setState({activeTab: tab, lastSearchResults: null})
    }
  }

  changeIndex(newIndex) {
    this.removeSearchListeners(this.helper)
    this.helper = this.helper.setIndex(newIndex)
    this.setupSearchListeners(this.helper)
    return this.helper
  }

  _changeQuery = (e) => {
    const helper = this.helper
    const q = e.target.value
    const hasSearchText = q.length > 0
    if (this.state.activeTab === 'STORIES') {
      this.setState({
        activeTab: 'STORIES',
        hasSearchText
      })
    }

    if (_.isString(q) && q.length === 0) {
      this.setState({
        lastSearchResults: null,
        searching: false,
        hasSearchText
      })
      return
    } else if (_.isString(q) && q.length < 3) {
      if (hasSearchText && !this.state.hasSearchText) {
        this.setState({hasSearchText})
      }
      return
    }

    _.debounce(() => {
      helper
        .setQuery(q)
        .search()
    }, 300)()
  }


  componentDidMount() {
    this.props.loadCategories()
  }

  setFocus = () => {
    if (this.state.activeTab === 'STORIES') this.setState({activeTab: 'STORIES'})
  }

  checkClearResults = (text) => {
    if (text.length <= 2) {
      this.setState({lastSearchResults: null})
    }
  }

  resetSearchText = () => {
    this.refs.outterHeaderInput.refs.innerHeaderInput.value = ''
    this.setState({hasSearchText: false})
  }

  renderActiveTab = () => {
    if (this.state.activeTab === 'PEOPLE') {
      return (
        <SearchResultsPeople
          userSearchResults={this.state.lastSearchResults.hits}
        />
      )
    }
    else {
      return (
        <SearchResultsStories
          storySearchResults={feedExample}
          userSearchResults={this.state.lastSearchResults.hits}
        />
      )
    }
  }

  render() {
    return (
      <Container>
        <HeaderInputContainer between='xs'>
          <HeaderInput
              placeholder='Type to search'
              ref={'outterHeaderInput'}
              innerRef={'innerHeaderInput'}
              placeholderTextColor='#757575'
              onFocus={this.setFocus}
              onChange={e => this._changeQuery(e)}
              onChangeText={this.checkClearResults}
              returnKeyType='search'
          />
          <Text
              onClick={() => {this.resetSearchText()}}
          >Cancel</Text>
        </HeaderInputContainer>
        <ContentWrapper>
          <TabBar
            tabs={tabBarTabs}
            activeTab={this.state.activeTab}
            onClickTab={this.onClickTab}
            whiteBG
          />
          {this.state.lastSearchResults && this.renderActiveTab()}
        </ContentWrapper>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
    error: categoriesError
  } = state.entities.categories;

  return {
    user: state.entities.users.entities[state.session.userId],
    users: state.entities.users.entities,
    categories,
    categoriesFetchStatus,
    error: categoriesError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
