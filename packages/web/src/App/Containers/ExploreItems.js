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
import UserActions from '../Shared/Redux/Entities/Users'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignupActions from '../Shared/Redux/SignupRedux'

import ContainerWithFeedList from './ContainerWithFeedList'
import ExploreFeedHeader from '../Components/ExploreFeedHeader'
import UserFeed from './UserFeed'
import CategoryFeed from './CategoryFeed'

import { runIfAuthed } from '../Lib/authHelpers'

const ContentWrapper = styled.div``

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

  componentDidMount() {
    const { category, loadCategories } = this.props
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    if (values.type === 'category') {
      if (!category) loadCategories()
    }
  }

  _followItem = itemId => {
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    values.type === 'category'
      ? this.props.followCategory(this.props.sessionUserId, itemId)
      : this.props.followUser(this.props.sessionUserId, itemId)
    this.props.loadUserFollowing(itemId)
  }

  _unfollowItem = itemId => {
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    values.type === 'category'
      ? this.props.unfollowCategory(this.props.sessionUserId, itemId)
      : this.props.unfollowUser(this.props.sessionUserId, itemId)
    this.props.loadUserFollowing(itemId)
  }

  render() {
    const { category, isFollowingCategory, user, isFollowingUsers } = this.props
    const queryReqest = this.props.location.search
    const values = queryString.parse(queryReqest)
    return (
      <ContentWrapper>
        <ExploreFeedHeader
          category={category}
          user={user}
          followItem={this._followItem}
          unfollowItem={this._unfollowItem}
          isFollowingCategory={isFollowingCategory || isFollowingUsers}
        />
        {values.type === 'category' && <CategoryFeed {...this.props} />}
        {values.type === 'channel' && (
          <ContentWrapper>
            <UserFeed
              {...this.props}
              getGuides={this.props.getUserGuides}
              guidesById={this.props.userGuidesById}
              isChannel={true}
              getStories={this.props.getUserStories}
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
  const myFollowedUsersObject
    = state.entities.users.userFollowingByUserIdAndId[sessionUserId]
  const followedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined

  const isFollowingUsers = _.includes(followedUsers, userId)

  const isFollowingCategory
    = sessionUserId && _.includes(state.signup.selectedCategories, categoryId)

  return {
    sessionUserId,
    categoryId,
    user: state.entities.users.entities[userId],
    category: state.entities.categories.entities[categoryId],
    fetchStatus: getFetchStatus(state.entities.stories, categoryId),
    storiesById: getByCategory(state.entities.stories, categoryId),
    stories: state.entities.stories.entities,
    userFeedById: getByUser(state.entities.stories, userId),
    guides: state.entities.guides.entities,
    guidesById: _.get(state, `entities.guides.guideIdsByCategoryId[${categoryId}`, []),
    userGuidesById: _.get(state, `entities.guides.guideIdsByUserId[${userId}]`, []),
    isFollowingCategory,
    isFollowingUsers,
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
    getUserStories: () => dispatch(StoryActions.fromUserRequest(targetUserId)),
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    getCategoryGuides: () => dispatch(GuideActions.getCategoryGuides(categoryId)),
    getUserGuides: () => dispatch(GuideActions.getUserGuides(targetUserId)),
    followCategory: (sessionUserId, categoryId) =>
      dispatch(
        runIfAuthed(sessionUserId, SignupActions.signupFollowCategory, [categoryId]),
      ),
    unfollowCategory: (sessionUserId, categoryId) =>
      dispatch(
        runIfAuthed(sessionUserId, SignupActions.signupUnfollowCategory, [categoryId]),
      ),
    followUser: (sessionUserId, userIdToFollow) =>
      dispatch(
        runIfAuthed(sessionUserId, UserActions.followUser, [
          sessionUserId,
          userIdToFollow,
        ]),
      ),
    unfollowUser: (sessionUserId, userIdToUnfollow) =>
      dispatch(
        runIfAuthed(sessionUserId, UserActions.unfollowUser, [
          sessionUserId,
          userIdToUnfollow,
        ]),
      ),
    loadUserFollowing: sessionUserId =>
      dispatch(UserActions.loadUserFollowing(sessionUserId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Category)
