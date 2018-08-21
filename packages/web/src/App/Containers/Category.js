import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'

import StoryActions, {getByCategory, getFetchStatus} from '../Shared/Redux/Entities/Stories'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import GuideActions from '../Shared/Redux/Entities/Guides'

import ContainerWithFeedList from './ContainerWithFeedList'
import CategoryHeader from '../Components/CategoryHeader'
import TabBar from '../Components/TabBar'
import FeedItemList from '../Components/FeedItemList'
import Footer from '../Components/Footer'
import ShowMore from '../Components/ShowMore'

const tabBarTabs = ['ALL', 'SEE', 'DO', 'EAT', 'STAY', 'GUIDES']

const ContentWrapper = styled.div``

const FeedItemListWrapper = styled.div`
  margin: 50px 7% 0;
`

class Category extends ContainerWithFeedList {
  static propTypes = {
    users: PropTypes.object,
    categoryId: PropTypes.string,
    category: PropTypes.object,
    loadCategories: PropTypes.func,
  }

  state = { activeTab: 'ALL' }

  componentDidMount() {
    const {category, loadCategories} = this.props
    this.getTabInfo(this.state.activeTab)
    if (!category) loadCategories()
  }

  render() {
    const {category} = this.props
    const {selectedFeedItems} = this.getSelectedFeedItems()

    return (
      <ContentWrapper>
        <CategoryHeader category={category}/>
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <FeedItemListWrapper>
          <FeedItemList feedItems={selectedFeedItems} />
          <ShowMore/>
          <Footer />
        </FeedItemListWrapper>
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  return {
    categoryId,
    category: state.entities.categories.entities[categoryId],
    fetchStatus: getFetchStatus(state.entities.stories, categoryId),
    storiesById: getByCategory(state.entities.stories, categoryId),
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    guidesById: _.get(state, `entities.guides.guideIdsByCategoryId[${categoryId}]`, []),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  return {
    getStories: (ignore, storyType) => {
      storyType = storyType.toLowerCase()
      if (storyType === 'all') storyType = null
      dispatch(StoryActions.fromCategoryRequest(categoryId, storyType))
    },
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    getGuides: () => dispatch(GuideActions.getCategoryGuides(categoryId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)
