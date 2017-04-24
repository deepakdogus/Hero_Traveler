import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  feedRequest: ['userId'],
  feedSuccess: ['userFeedById'],
  feedFailure: ['error'],
  fromUserRequest: ['userId'],
  fromUserSuccess: ['userId', 'userStoriesById'],
  fromUserFailure: ['error'],
  fromCategoryRequest: ['categoryId'],
  fromCategorySuccess: ['categoryId', 'categoryStoriesById'],
  fromCategoryFailure: ['error'],
  storyLike: ['storyId'],
  storyLikeFailure: ['storyId'],
  storyBookmark: ['storyId'],
  storyBookmarkFailure: ['storyId'],
  receiveStories: ['stories']
})

export const StoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const initialFetchStatus = () => ({
  fetching: false,
  loaded: false,
})

export const INITIAL_STATE = Immutable({
  entities: {},
  userFeedById: [],
  storiesByUserAndId: {},
  storiesByCategoryAndId: {},
  fetchStatus: initialFetchStatus(),
  userStoriesFetchStatus: initialFetchStatus(),
  userBookmarksFetchStatus: initialFetchStatus(),
  error: null,
})

/* ------------- Reducers ------------- */

// request the temperature for a city
export const feedRequest = (state, { userId }) => {
  return Immutable.setIn(
    state,
    ['fetchStatus', 'fetching'],
    true
  );
}
// successful temperature lookup
export const feedSuccess = (state, {userFeedById}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null
  }, {
    deep: true
  })
}

export const userRequest = (state, {userId}) => {
  return state.setIn(
    ['storiesByUserAndId', userId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const userSuccess = (state, {userId, userStoriesById}) => {
  return state.setIn(
    ['storiesByUserAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
  .setIn(
    ['storiesByUserAndId', userId, 'byId'],
    userStoriesById
  )
}

export const userFailure = (state, {error}) => {
  return state.setIn(
    ['storiesByUserAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
  )
  .setIn(
    ['storiesByUserAndId', userId, 'byId'],
    userStoriesById
  )
}

export const categoryRequest = (state, {categoryId}) => {
  return state.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const categorySuccess = (state, {categoryId, categoryStoriesById}) => {
  return state.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
  .setIn(
    ['storiesByCategoryAndId', categoryId, 'byId'],
    categoryStoriesById
  )
}

export const categoryFailure = (state, {error}) => {
  return state.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
  )
  .setIn(
    ['storiesByCategoryAndId', categoryId, 'byId'],
    categoryStoriesById
  )
}

export const failure = (state, {error}) =>
  state.merge({
    fetchStatus: {
      fetching: false,
      loaded: false
    },
    error
  }, {
    deep: true
  })

// Toggle like optimistically
const storyLike = (state, {storyId}) => {
  const isToggled = _.get(state, `entities.${storyId}.isLiked`, false)
  const numOfLikes = _.get(state, `entities.${storyId}.counts.likes`, 0)
  return state.setIn(
    ['entities', storyId, 'counts', 'likes'],
    !isToggled ? numOfLikes + 1 : numOfLikes - 1
  )
}

// Revert the optimistic update on like failure
const storyLikeFailure = (state, {storyId}) => {
  const numOfLikes = _.get(state, `entities.${storyId}.counts.likes`, 0)
  return state.setIn(
    ['entities', storyId, 'counts', 'likes'],
    !isToggled ? numOfLikes - 1 : numOfLikes + 1
  )
}

// Increase count of bookmarks
const storyBookmark = (state, {storyId}) => {
  const isToggled = _.get(state, `entities.${storyId}.isBookmarked`, false)
  const numOfLikes = _.get(state, `entities.${storyId}.counts.bookmarks`, 0)
  return state.setIn(
    ['entities', storyId, 'counts', 'bookmarks'],
    !isToggled ? numOfLikes + 1 : numOfLikes - 1
  )
}

// Revert the optimistic update on bookmark failure
const storyBookmarkFailure = (state, {storyId}) => {
  const isToggled = _.get(state, `entities.${storyId}.isBookmarked`, false)
  const numOfLikes = _.get(state, `entities.${storyId}.counts.bookmarks`, 0)
  return state.setIn(
    ['entities', storyId, 'counts', 'bookmarks'],
    !isToggled ? numOfLikes - 1 : numOfLikes + 1
  )
}

export const updateEntities = (state, {stories = {}}) => {
  return state.merge({entities: stories}, {deep: true})
}

/* ------------- Selectors ------------- */

export const getByCategory = (state, categoryId) => {
  return state.getIn(['storiesByCategoryAndId', categoryId, 'byId'], [])
}

export const getFetchStatus = (state, categoryId) => {
  return state.getIn(['storiesByCategoryAndId', categoryId, 'fetchStatus'], {})
}

export const getIdsByUser = (state, userId: string) => {
  return state.getIn(['storiesByUser', userId, 'byId'], [])
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEED_REQUEST]: feedRequest,
  [Types.FEED_SUCCESS]: feedSuccess,
  [Types.FEED_FAILURE]: failure,
  [Types.FROM_USER_REQUEST]: userRequest,
  [Types.FROM_USER_SUCCESS]: userSuccess,
  [Types.FROM_USER_FAILURE]: userFailure,
  [Types.FROM_CATEGORY_REQUEST]: categoryRequest,
  [Types.FROM_CATEGORY_SUCCESS]: categorySuccess,
  [Types.FROM_CATEGORY_FAILURE]: categoryFailure,
  [Types.STORY_LIKE]: storyLike,
  [Types.STORY_LIKE_FAILURE]: storyLikeFailure,
  [Types.STORY_BOOKMARK]: storyBookmark,
  [Types.STORY_BOOKMARK_FAILURE]: storyBookmarkFailure,
  [Types.RECEIVE_STORIES]: updateEntities,
})
