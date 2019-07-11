import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import UserActions from '../../Shared/Redux/Entities/Users'
import HistoryActions from '../../Shared/Redux/HistoryRedux'
import getGridData from '../../Shared/Lib/getGridData'

import styles, { ExploreItemFeedNavActionStyles } from '../Styles/ExploreScreenStyles'

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
    loadChannels: PropTypes.func,
    categories: PropTypes.object,
    categoriesFetchStatus: PropTypes.object,
    user: PropTypes.object,
    users: PropTypes.object,
    addRecentSearch: PropTypes.func,
    searchHistory: PropTypes.object,
    channelsByID: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: tabTypes.channels,
    }
  }

  componentDidMount() {
    this.props.loadCategories()
    this.props.loadChannels()
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

  _navToCategoryFeed = tile => {
    NavActions.explore_categoryFeed({
      profileId: tile.id,
      title: tile.title,
      leftButtonIconStyle: ExploreItemFeedNavActionStyles.leftButtonIconStyle,
      navigationBarStyle: ExploreItemFeedNavActionStyles.navigationBarStyle,
      isChannel: tile.username ? true : false,
    })
  }

  getExploreItemsByType = () => {
    const { selectedTab } = this.state
    const { channelsByID, users, categories } = this.props
    return getGridData(selectedTab, channelsByID, users, categories, tabTypes)
  }

  render() {
    const {
      categoriesFetchStatus,
      stories,
      searchHistory,
      addRecentSearch,
      user,
    } = this.props

    const { selectedTab } = this.state
    const exploreItemArray = _.values(this.getExploreItemsByType())

    const content
      = categoriesFetchStatus.fetching && !exploreItemArray.length ? (
        <Loader style={styles.loader} />
      ) : (
        <ScrollView>
          <ExploreGrid
            onPress={this._navToCategoryFeed}
            exploreItems={exploreItemArray}
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
