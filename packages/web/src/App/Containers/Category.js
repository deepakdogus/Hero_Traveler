import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import queryString from 'query-string'

import StoryActions, { getByCategory, getFetchStatus } from '../Shared/Redux/Entities/Stories'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignupActions from '../Shared/Redux/SignupRedux'

import ContainerWithFeedList from './ContainerWithFeedList'
import CategoryHeader from '../Components/CategoryHeader'
import TabBar from '../Components/TabBar'
import FeedItemList from '../Components/FeedItemList'
import Footer from '../Components/Footer'

import { runIfAuthed } from '../Lib/authHelpers'

const tabBarTabs = ['ALL', 'SEE', 'DO', 'EAT', 'STAY', 'GUIDES']

const ContentWrapper = styled.div``

const FeedItemListWrapper = styled.div`
  margin: 50px 7% 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

class Category extends ContainerWithFeedList {
  static propTypes = {
    users: PropTypes.object,
    categoryId: PropTypes.string,
    category: PropTypes.object,
    loadCategories: PropTypes.func,
    loadCategoryStories: PropTypes.func,
    followCategory: PropTypes.func,
    unfollowCategory: PropTypes.func,
    isFollowingCategory: PropTypes.bool,
  }

  state = { activeTab: 'ALL' }

  componentDidMount() {
    const {category, loadCategories} = this.props
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    console.log(this.props,'this is the category')
    this.getTabInfo()
    if (!category) loadCategories()
  }

  _followCategory = (categoryId) => {
    this.props.followCategory(this.props.sessionUserId, categoryId)
  }

  _unfollowCategory = (categoryId) => {
    this.props.unfollowCategory(this.props.sessionUserId, categoryId)
  }

  render() {
    const {
      category,
      isFollowingCategory,
    } = this.props
    const {selectedFeedItems} = this.getSelectedFeedItems()

    return (
      <ContentWrapper>
        <CategoryHeader
          category={category}
          followCategory={this._followCategory}
          unfollowCategory={this._unfollowCategory}
          isFollowingCategory={isFollowingCategory}
        />
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <FeedItemListWrapper>
          <FeedItemList
            feedItems={selectedFeedItems}
            activeTab={this.state.activeTab === 'GUIDES' ? 'GUIDES' : 'STORIES'}
          />
          <Footer />
        </FeedItemListWrapper>
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  const sessionUserId = state.session.userId
  let isFollowingCategory = false
  if (state.session.userId) {
    isFollowingCategory = _.includes(state.signup.selectedCategories, categoryId)
  }

  return {
    sessionUserId,
    categoryId,
    category: state.entities.categories.entities[categoryId],
    fetchStatus: getFetchStatus(state.entities.stories, categoryId),
    storiesById: getByCategory(state.entities.stories, categoryId),
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    guidesById: _.get(state, `entities.guides.guideIdsByCategoryId[${categoryId}]`, []),
    isFollowingCategory,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  return {
    getStories: (_0, _1, storyType) => {
      storyType = storyType.toLowerCase()
      if (storyType === 'all') storyType = null
      dispatch(StoryActions.fromCategoryRequest(categoryId, storyType))
    },
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    getGuides: () => dispatch(GuideActions.getCategoryGuides(categoryId)),
    followCategory: (sessionUserId, categoryId) =>
      dispatch(runIfAuthed(sessionUserId, SignupActions.signupFollowCategory, [categoryId])),
    unfollowCategory: (sessionUserId, categoryId) =>
      dispatch(runIfAuthed(sessionUserId, SignupActions.signupUnfollowCategory, [categoryId])),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Category)
