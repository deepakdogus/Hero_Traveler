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

import CategoryActions from '../../Shared/Redux/Entities/Categories'
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
  }

  constructor(props) {
    super(props)
    this.state = {
      lastSearchResults: null,
      selectedTabIndex: null,
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
    const q = e.nativeEvent.text
    const hasSearchText = q.length > 0
    if (this.state.selectedTabIndex === null) {
      this.setState({
        selectedTabIndex: 0,
        hasSearchText,
      })
    }

    if (_.isString(q) && q.length === 0) {
      this.setState({
        lastSearchResults: null,
        searching: false,
        hasSearchText,
      })
      return
    }
    else if (_.isString(q) && q.length < 3) {
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
    this.setState({hasSearchText: false})
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

  render () {
    const {categories = {}, categoriesFetchStatus} = this.props
    let content

    const showSearch = this.state.lastSearchResults || this.state.selectedTabIndex !== null
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
            isSearching={this.state.searching}
            userId={this.props.user.id}
            query={this.helper.state.query}
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
              ref={c => this._searchInput = c}
              style={styles.searchInput}
              placeholder='Search'
              placeholderTextColor='#757575'
              onFocus={this.setFocus}
              onChange={e => this._changeQuery(e)}
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
            <TouchableOpacity onPress={() => {
              this._searchInput.setNativeProps({text: ''})
              this.setState({selectedTabIndex: null, lastSearchResults: null})
            }}>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
