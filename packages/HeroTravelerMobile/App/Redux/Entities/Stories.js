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
  toggleLike: ['storyId', 'wasLiked'],
  storyLike: ['userId', 'storyId'],
  // storyLikeFailure: ['storyId', 'wasLiked'],
  toggleBookmark: ['storyId', 'wasLiked'],
  storyBookmark: ['userId', 'storyId'],
  // storyBookmarkFailure: ['storyId', 'wasLiked'],
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
  return state.setIn(
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
    userFeedById,
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
  .setIn(
    ['storiesByUserAndId', userId, 'byId'],
    []
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
}

export const categoryRequest = (state, {categoryId}) => {
  return state.setIn(
    ['storiesByCategoryAndId', categoryId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
  // .setIn(
  //   ['storiesByCategoryAndId', categoryId, 'byId'],
  //   []
  // )
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
const storyLike = (state, {storyId, wasLiked}) => {
  const numOfLikes = _.get(state, `entities.${storyId}.counts.likes`, 0)
  return state.setIn(
    ['entities', storyId, 'counts', 'likes'],
    !wasLiked ? numOfLikes + 1 : numOfLikes - 1
  )
}

// // Revert the optimistic update on like failure
// const storyLikeFailure = (state, {storyId, wasLiked}) => {
//   const numOfLikes = _.get(state, `entities.${storyId}.counts.likes`, 0)
//   return state.setIn(
//     ['entities', storyId, 'counts', 'likes'],
//     !wasLiked ? numOfLikes - 1 : numOfLikes + 1
//   )
// }

// Increase count of bookmarks
const storyBookmark = (state, {storyId, wasLiked}) => {
  const numOfLikes = _.get(state, `entities.${storyId}.counts.bookmarks`, 0)
  return state.setIn(
    ['entities', storyId, 'counts', 'bookmarks'],
    !wasLiked ? numOfLikes + 1 : numOfLikes - 1
  )
}

// // Revert the optimistic update on bookmark failure
// const storyBookmarkFailure = (state, {storyId, wasLiked}) => {
//   const numOfLikes = _.get(state, `entities.${storyId}.counts.bookmarks`, 0)
//   return state.setIn(
//     ['entities', storyId, 'counts', 'bookmarks'],
//     !wasLiked ? numOfLikes - 1 : numOfLikes + 1
//   )
// }

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

export const getByUser = (state, userId) => {
  return state.getIn(['storiesByUserAndId', userId, 'byId'], [])
}

export const getUserFetchStatus = (state, userId) => {
  return state.getIn(['storiesByUserAndId', userId, 'fetchStatus'], {})
}

// export const getIdsByUser = (state, userId: string) => {
//   return state.getIn(['storiesByUser', userId, 'byId'], [])
// }

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
  [Types.TOGGLE_LIKE]: storyLike,
  // [Types.STORY_LIKE_FAILURE]: storyLikeFailure,
  [Types.TOGGLE_BOOKMARK]: storyBookmark,
  // [Types.STORY_BOOKMARK_FAILURE]: storyBookmarkFailure,
  [Types.RECEIVE_STORIES]: updateEntities,
})
