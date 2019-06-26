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
import UserFeed from '../Components/UserFeed'

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
    const { category, loadCategories } = this.props
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    this.getTabInfo()
    if (values.type === 'category') {
      if (!category) loadCategories()
    }
  }

  _followItem = (itemId) => {
    this.props.followCategory(this.props.sessionUserId, itemId)
  }

  _unfollowItem = (itemId) => {
    this.props.unfollowCategory(this.props.sessionUserId, itemId)
  }

  render() {
    const {
      category,
      isFollowingCategory,
      user,
    } = this.props
    const {selectedFeedItems} = this.getSelectedFeedItems()
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    return (
      <ContentWrapper>
        <CategoryHeader
          category={category}
          user={user}
          followItem={this._followItem}
          unfollowItem={this._unfollowItem}
          isFollowingCategory={isFollowingCategory}
        />
        {values.type === 'category' && (
        <ContentWrapper>
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
        )}
        {values.type === 'channel' && (
        <ContentWrapper>
          <UserFeed 
            {...this.props}
            getGuides={this.props.getUserGuides}
            guidesById={this.props.userGuidesById}
            isChannel={true} 
          />
        </ContentWrapper>
        )}
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  const userId = ownProps.match.params.userId
  const sessionUserId = state.session.userId
  let isFollowingCategory = false
  if (state.session.userId) {
    isFollowingCategory = _.includes(state.signup.selectedCategories, (categoryId || userId))
  }

  return {
    sessionUserId,
    categoryId,
    user: state.entities.users.entities[userId],
    category: state.entities.categories.entities[categoryId],
    fetchStatus: getFetchStatus(state.entities.stories, categoryId),
    storiesById: getByCategory(state.entities.stories, categoryId),
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    guidesById: _.get(state, `entities.guides.guideIdsByCategoryId[${categoryId}`, []),
    userGuidesById: _.get(state, `entities.guides.guideIdsByUserId[${userId}]`, []),
    isFollowingCategory,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  const targetUserId = ownProps.match.params.userId

  return {
    getStories: (_0, _1, storyType) => {
      storyType = storyType.toLowerCase()
      if (storyType === 'all') storyType = null
      dispatch(StoryActions.fromCategoryRequest(categoryId, storyType))
    },
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    getCategoryGuides: () => dispatch(GuideActions.getCategoryGuides(categoryId)),
    getUserGuides: () => dispatch(GuideActions.getUserGuides(targetUserId)),
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