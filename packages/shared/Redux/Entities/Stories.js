import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storyRequest: ['storyId'],
  feedRequest: ['userId'],
  feedSuccess: ['userFeedById'],
  feedFailure: ['error'],
  fromUserRequest: ['userId'],
  fromUserSuccess: ['userId', 'userStoriesById'],
  fromUserFailure: ['userId', 'error'],
  fromCategoryRequest: ['categoryId', 'storyType'],
  fromCategorySuccess: ['categoryId', 'categoryStoriesById'],
  fromCategoryFailure: ['categoryId', 'error'],
  loadDrafts: null,
  loadDraftsSuccess: ['draftsById'],
  loadDraftsFailure: ['error'],
  toggleLike: ['storyId', 'wasLiked'],
  storyLike: ['userId', 'storyId'],
  flagStory: ['userId', 'storyId'],
  // storyLikeFailure: ['storyId', 'wasLiked'],
  toggleBookmark: ['storyId', 'wasLiked'],
  storyBookmark: ['userId', 'storyId'],
  // storyBookmarkFailure: ['storyId', 'wasLiked'],
  getBookmarks: ['userId'],
  getBookmarksSuccess: ['userId', 'bookmarks'],
  getBookmarksFailure: ['userId', 'error'],
  receiveStories: ['stories'],
  deleteStory: ['userId', 'storyId'],
  deleteStorySuccess: ['userId', 'storyId'],
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
  drafts: {
    error: null,
    fetchStatus: initialFetchStatus(),
    byId: []
  }
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

export const userFailure = (state, {userId, error}) => {
  return state.setIn(
    ['storiesByUserAndId', userId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
  )
}

export const getBookmarks = (state, {userId}) => {
  return state.setIn(
    ['bookmarks', userId, 'fetchStatus'],
    {fetching: true, loaded: false}
  )
}

export const getBookmarksSuccess = (state, {userId, bookmarks}) => {
  return state.setIn(
    ['bookmarks', userId, 'fetchStatus'],
    {fetching: false, loaded: true}
  )
}

export const getBookmarksFailure = (state, {userId, error}) => {
  return state.setIn(
    ['bookmarks', userId, 'fetchStatus'],
    {fetching: false, loaded: false, error}
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

export const categoryFailure = (state, {categoryId, error}) => {
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

export const loadDrafts = (state) => {
  return state.merge({
    drafts: {
      error: null,
      fetchStatus: {
        fetching: true,
        loaded: false
      },
      byId: []
    }
  })
}

export const loadDraftsSuccess = (state, {draftsById}) => {
  return state.merge({
    drafts: {
      fetchStatus: {
        fetching: false,
        loaded: true
      },
      byId: draftsById
    }
  })
}

export const loadDraftsFailure = (state, {error}) => {
  return state.merge({
    drafts: {
      error,
      fetchStatus: {
        fetching: false,
        loaded: false
      },
      byId: []
    }
  })
}


export const deleteStory = (state, {userId, storyId}) => {
  return state
}

export const deleteStorySuccess = (state, {userId, storyId}) => {
  let newState = state.setIn(['entities'], state.entities.without(storyId))

  const story = state.entities[storyId]

  if (story.draft) {
    const path = ['drafts', 'byId']
    return newState.setIn(path, _.without(state.getIn(path, storyId)))
  } else {
    const path = ['storiesByUserAndId', userId, 'byId']
    return newState.setIn(path, _.without(state.getIn(path, storyId)))
  }
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

export const getBookmarksFetchStatus = (state, userId) => {
  return state.getIn(['bookmarks', userId, 'fetchStatus'], {})
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
  [Types.LOAD_DRAFTS]: loadDrafts,
  [Types.LOAD_DRAFTS_SUCCESS]: loadDraftsSuccess,
  [Types.LOAD_DRAFTS_FAILURE]: loadDraftsFailure,
  [Types.TOGGLE_LIKE]: storyLike,
  [Types.TOGGLE_BOOKMARK]: storyBookmark,
  [Types.RECEIVE_STORIES]: updateEntities,
  [Types.DELETE_STORY]: deleteStory,
  [Types.DELETE_STORY_SUCCESS]: deleteStorySuccess,
  [Types.GET_BOOKMARKS]: getBookmarks,
  [Types.GET_BOOKMARKS_SUCCESS]: getBookmarksSuccess,
  [Types.GET_BOOKMARKS_FAILURE]: getBookmarksFailure,
})
