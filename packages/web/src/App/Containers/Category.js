import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import queryString from 'query-string'

import StoryActions, {
  getByCategory,
  getFetchStatus,
  getByUser,
} from '../Shared/Redux/Entities/Stories'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignupActions from '../Shared/Redux/SignupRedux'
import UserActions from '../Shared/Redux/Entities/Users'

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
    userOrCategoryId: PropTypes.string,
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
    if (values.type === category) {
      if (!category) loadCategories()
    }
  }

  _followCategory = categoryOrUserId => {
    this.props.followCategory(this.props.sessionUserId, categoryOrUserId)
  }

  _unfollowCategory = categoryOrUserId => {
    this.props.unfollowCategory(this.props.sessionUserId, categoryOrUserId)
  }

  render() {
    const { category, isFollowingCategory, user } = this.props
    const { selectedFeedItems } = this.getSelectedFeedItems()
    return (
      <ContentWrapper>
        <CategoryHeader
          category={category}
          user={user}
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
  const userOrCategoryId = ownProps.match.params.categoryId || ownProps.match.params.userId
  const sessionUserId = state.session.userId
  let isFollowingCategory = false
  const queryReqest = ownProps.location.search
  const values = queryString.parse(queryReqest)
  const categoryOrChannelSearch = values.type === 'channel' 
    ? `entities.guides.guideIdsByUserId[${userOrCategoryId}]`
    : `entities.guides.guideIdsByCategoryId[${userOrCategoryId}]`

  if (state.session.userId) {
    isFollowingCategory = _.includes(state.signup.selectedCategories, userOrCategoryId)
  }

  return {
    sessionUserId,
    userOrCategoryId,
    category: state.entities.categories.entities[userOrCategoryId],
    user: state.entities.users.entities[userOrCategoryId],
    fetchStatus: getFetchStatus(state.entities.stories, userOrCategoryId),
    storiesById:
      values && values.type === 'channel'
        ? getByUser(state.entities.stories, userOrCategoryId)
        : getByCategory(state.entities.stories, userOrCategoryId),
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    guidesById: _.get(state, (categoryOrChannelSearch), []),
    isFollowingCategory,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const userOrCategoryId = ownProps.match.params.categoryId || ownProps.match.params.userId
  return {
    getStories: (_0, _1, storyType) => {
      storyType = storyType.toLowerCase()
      if (storyType === 'all') storyType = null
      dispatch(StoryActions.fromCategoryRequest(userOrCategoryId, storyType))
    },
    getUserStories: (userOrCategoryId, storyType) =>
      dispatch(StoryActions.fromUserRequest(userOrCategoryId, storyType)),
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    loadUsers: () => dispatch(UserActions.loadUser()),
    getGuides: () => dispatch(GuideActions.getCategoryGuides(userOrCategoryId)),
    getUserGuides: () => dispatch(GuideActions.getUserGuides(userOrCategoryId)),
    followCategory: (sessionUserId, userOrCategoryId) =>
      dispatch(
        runIfAuthed(sessionUserId, SignupActions.signupFollowCategory, [userOrCategoryId]),
      ),
    unfollowCategory: (sessionUserId, userOrCategoryId) =>
      dispatch(
        runIfAuthed(sessionUserId, SignupActions.signupUnfollowCategory, [userOrCategoryId]),
      ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Category)
