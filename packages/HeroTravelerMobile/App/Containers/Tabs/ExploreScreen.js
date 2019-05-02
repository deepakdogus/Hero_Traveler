import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'

import CategoryActions from '../../Shared/Redux/Entities/Categories'
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
    }
  }

  componentDidMount() {
    this.props.loadCategories()
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
    })
  }

  getEntitiesByType = () => {
    const {selectedTab} = this.state
    switch(selectedTab){
      case tabTypes.categories:
        return this.props.categories
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
    stories: state.entities.stories.entities,
    searchHistory: state.history.searchHistory,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    addRecentSearch: search => dispatch(HistoryActions.addRecentSearch(search)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExploreScreen)
