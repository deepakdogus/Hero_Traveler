import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import UserActions from '../../Shared/Redux/Entities/Users'
import HistoryActions from '../../Shared/Redux/HistoryRedux'

import styles, {
  CategoryFeedNavActionStyles,
} from '../Styles/ExploreScreenStyles'

import Loader from '../../Components/Loader'
import ExploreGrid from '../../Components/ExploreGrid'
import TabBar from '../../Components/TabBar'
import SearchPlacesPeople from '../SearchPlacesPeople'

const tabTypes = {
  channels: 'channels',
  categories: 'categories',
}

class ExploreScreen extends Component {
  static propTypes = {
    stories: PropTypes.object,
    loadCategories: PropTypes.func,
    categories: PropTypes.object,
    categoriesFetchStatus: PropTypes.object,
    user: PropTypes.object,
    addRecentSearch: PropTypes.func,
    searchHistory: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: tabTypes.categories,
      channelsSize: false,
    }
  }

  componentDidMount() {
    this.props.loadCategories()
    this.props.loadChannels()
    //load channels here
  }

  selectTab = selectedTab => {
    this.setState({ selectedTab })
  }

  renderTabs = () => (
    <TabBar
      tabs={tabTypes}
      activeTab={this.state.selectedTab}
      onClickTab={this.selectTab}
      tabStyle={styles.tabStyle}
    />

  )

  _navToCategoryFeed = category => {
    NavActions.explore_categoryFeed({
      categoryId: category.id,
      title: category.title,
      leftButtonIconStyle: CategoryFeedNavActionStyles.leftButtonIconStyle,
      navigationBarStyle: CategoryFeedNavActionStyles.navigationBarStyle,
      isCategory: category.username ? true : false,
    })
  }

  getEntitiesByType = () => {
    const {selectedTab} = this.state
    const {channelsByID, users, categories} = this.props
    const filteredChannelsThatAreUsers = []
    if(selectedTab === tabTypes.channels){
      for(let i = 0; i < channelsByID.length; i++){
        if(users[channelsByID[i]]){
          filteredChannelsThatAreUsers.push(users[channelsByID[i]])
        }
      }
    }

    switch(selectedTab){
      case tabTypes.categories:
        return categories
      case tabTypes.channels:
        return filteredChannelsThatAreUsers
      default:
        return []
    }
  }

  render() {
    const {
      categoriesFetchStatus,
      stories,
      searchHistory,
      addRecentSearch,
      user,
    } = this.props

    const {selectedTab} = this.state

    const categoriesArray = _.values(this.getEntitiesByType())

    const content = (
      categoriesFetchStatus.fetching && !categoriesArray.length
      ) ? (
        <Loader style={styles.loader} />
      ) : (
        <ScrollView>
          <ExploreGrid
            onPress={this._navToCategoryFeed}
            categories={categoriesArray}
            isChannel={selectedTab === tabTypes.channels ? true : false}
          />
        </ScrollView>
      )
      
    return (
      <View style={styles.root}>
        <SearchPlacesPeople
          stories={stories}
          searchHistory={searchHistory}
          addRecentSearch={addRecentSearch}
          user={user}
          renderTabs={this.renderTabs}
        >
          {content}
        </SearchPlacesPeople>
      </View>
    )
  }
}

const mapStateToProps = state => {
  let {
    entities: categories,
    fetchStatus: categoriesFetchStatus,
    error: categoriesError,
  } = state.entities.categories

  return {
    categories,
    categoriesFetchStatus,
    error: categoriesError,
    user: state.entities.users.entities[state.session.userId],
    users: state.entities.users.entities,
    stories: state.entities.stories.entities,
    searchHistory: state.history.searchHistory,
    channels: state.entities.users,
    channelsByID: state.entities.users.channelsByID,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    loadChannels: () => dispatch(UserActions.loadUsersChannels()),
    addRecentSearch: search => dispatch(HistoryActions.addRecentSearch(search)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExploreScreen)
