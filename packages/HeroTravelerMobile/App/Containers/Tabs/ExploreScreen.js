import _ from 'lodash'
import React, {Component} from 'react'
import {
  ScrollView,
  View,
  Text,
  ListView,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native'
import {connect} from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

// Search
import algoliasearchModule from 'algoliasearch/reactnative'
const algoliasearch = algoliasearchModule('BEEW4KQKOP', '9aa2c15ed03f4826dd559bea4087592e')
import AlgoliaSearchHelper from 'algoliasearch-helper';

import CategoryActions from '../../Redux/Entities/Categories'

import Loader from '../../Components/Loader'
import ExploreGrid from '../../Components/ExploreGrid'
import StorySearchList from '../../Components/StorySearchList'
import {Metrics} from '../../Themes'
import styles from '../Styles/ExploreScreenStyles'

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

class ExploreScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastSearchResults: null,
      selectedTabIndex: null
    }
  }

  componentWillMount() {
    this.helper = AlgoliaSearchHelper(algoliasearch, 'dev_STORIES')
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
    return selectedTabIndex === 0 ? 'dev_STORIES' : 'dev_USERS'
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
    const self = this

    if (this.state.selectedTabIndex === null) {
      this.setState({selectedTabIndex: 0})
    }

    if (_.isString(q) && q.length === 0) {
      setTimeout(() => {
        this.setState({
          lastSearchResults: null,
          searching: false,
          selectedTabIndex: null
        })
      }, 1000)
      return
    } else if (_.isString(q) && q.length < 3) {
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
    this.setState({
      searching: true,
      selectedTabIndex,
      lastSearchResults: null,
    })
    this.helper.search()
  }

  renderSearchSection() {
    const searchHits = _.get(this.state.lastSearchResults, 'hits', [])
    const isSearching = this.state.searching
    return (
      <View style={styles.tabs}>
        <View style={styles.tabnav}>
          <Tab
            selected={this.state.selectedTabIndex === 0}
            onPress={() => this._changeTab(0)}
            text='STORIES'
          />
          <Tab
            selected={this.state.selectedTabIndex === 1}
            onPress={() => this._changeTab(1)}
            text='PEOPLE'
          />
        </View>
        <View style={{flex: 1, flexDirection: 'column'}}>
        {isSearching && <Loader style={{
          flex: 1,
          position: 'absolute',
          marginTop: 400,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }} />}
        {searchHits.length > 0 && this.state.selectedTabIndex === 0 &&
          <ScrollView>
            <StorySearchList
              stories={searchHits}
              height={70}
              titleStyle={styles.storyTitleStyle}
              subtitleStyle={styles.subtitleStyle}
              forProfile={true}
              onPressStory={story => NavActions.story({
                storyId: story.id
              })}
            />
          </ScrollView>
        }
        {!isSearching && searchHits.length === 0 && this.state.selectedTabIndex === 0 &&
          <Text style={{color: 'white', padding: Metrics.section, textAlign: 'center'}}>No stories found</Text>
        }
        {!isSearching && searchHits.length > 0 && this.state.selectedTabIndex === 1 &&
          <Text style={{color: 'white', padding: Metrics.section, textAlign: 'center'}}>Render searched people</Text>
        }
        {!isSearching && searchHits.length === 0 && this.state.selectedTabIndex === 1 &&
          <Text style={{color: 'white', padding: Metrics.section, textAlign: 'center'}}>No users found</Text>
        }
        </View>
      </View>
    )
  }

  render () {
    let content

    const showSearch = this.state.lastSearchResults || this.state.selectedTabIndex !== null

    if (this.props.categoriesFetchStatus.fetching) {
      content = (
        <Loader style={styles.loader} />
      )
    } else if (showSearch) {
      content = this.renderSearchSection()
    } else {
      content = (
        <ExploreGrid
          onPress={(category) => {
            NavActions.explore_categoryFeed({
              categoryId: category.id,
              title: category.title
            })
          }}
          categories={_.values(this.props.categories)}
        />
      )
    }

    return (
      <ScrollView style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.headerSearch}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder='Search'
              placeholderTextColor='#757575'
              onChange={e => this._changeQuery(e)}
            />
          </View>
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
    error: categoriesError
  } = state.entities.categories;

  return {
    user: state.session.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
