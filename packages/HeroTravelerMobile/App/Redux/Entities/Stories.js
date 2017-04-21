import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  feedRequest: ['userId'],
  feedSuccess: ['userFeedById', 'stories'],
  feedFailure: null,
  fromUserRequest: ['userId'],
  fromUserSuccess: ['stories', 'userStoriesById'],
  fromUserFailure: null,
  storyLike: ['storyId'],
  storyLikeSuccess: null,
  storyLikeFailure: ['storyId'],
  storyBookmark: ['storyId'],
  storyBookmarkSuccess: ['storyId'],
  storyBookmarkFailure: ['storyId'],
  getBookmarks: null,
  getBookmarksSuccess: ['bookmarks', 'myBookmarksById'],
  getBookmarksFailure: null,
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
  userStoriesById: [],
  fetchStatus: initialFetchStatus(),
  userStoriesFetchStatus: initialFetchStatus(),
  userBookmarksFetchStatus: initialFetchStatus(),
  error: null,
})

/* ------------- Reducers ------------- */

// request the temperature for a city
export const request = (state, { userId }) => {
  return Immutable.setIn(
    state,
    ['fetchStatus', 'fetching'],
    true
  );
}
// successful temperature lookup
export const receive = (state, {userFeedById, stories = {}}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    userFeedById,
    entities: stories
  }, {
    deep: true
  })
}

export const requestById = (state) => {
  return state.merge({
    userStoriesFetchStatus: {
      fetching: true,
      loaded: false
    }
  }, {
    deep: true
  })
}

export const receiveById = (state, {stories = {}, userStoriesById}) => {
  return state.merge({
    userStoriesFetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    entities: stories,
  }, {
    deep: true
  })
  .setIn(
    ['userStoriesById'],
    userStoriesById
  )
}

export const receiveByIdFailure = (state, {error}) => {
  return state.merge({
    userStoriesFetchStatus: {
      fetching: false,
      loaded: false,
    },
    error
  }, {
    deep: true
  })
}

// failed to get the temperature
export const failure = (state) =>
  state.merge({
    fetchStatus: {
      fetching: false
    },
    error: 'Failed to get stories'
  }, {
    deep: true
  })

// Toggle like optimistically
const storyLike = (state, {storyId}) => {
  const isToggled = _.get(state, `entities.${storyId}.isLiked`, false)
  const numOfLikes = _.get(state, `entities.${storyId}.counts.likes`, 0)
  return state.setIn(
    ['entities', storyId, 'isLiked'],
    !isToggled
  )
  .setIn(
    ['entities', storyId, 'counts', 'likes'],
    !isToggled ? numOfLikes + 1 : numOfLikes - 1
  )
}

const storyLikeSuccess = (state) => state

// Revert the optimistic update on like failure
const storyLikeFailure = (state, {storyId}) => {
  const numOfLikes = _.get(state, `entities.${storyId}.counts.likes`, 0)
  return state.setIn(
    ['entities', storyId, 'counts', 'likes'],
    !isToggled ? numOfLikes - 1 : numOfLikes + 1
  )
}

// Toggle bookmark optimistically
const storyBookmark = (state, {storyId}) => {
  const isToggled = _.get(state, `entities.${storyId}.isBookmarked`, false)
  const numOfLikes = _.get(state, `entities.${storyId}.counts.bookmarks`, 0)
  return state.setIn(
    ['entities', storyId, 'isBookmarked'],
    !isToggled
  )
  .setIn(
    ['entities', storyId, 'counts', 'bookmarks'],
    !isToggled ? numOfLikes + 1 : numOfLikes - 1
  )
}
const storyBookmarkSuccess = (state, {}) => state
// Revert the optimistic update on bookmark failure
const storyBookmarkFailure = (state, {storyId}) => {
  const isToggled = _.get(state, `entities.${storyId}.isBookmarked`, false)
  const numOfLikes = _.get(state, `entities.${storyId}.counts.bookmarks`, 0)
  return state.setIn(
    ['entities', storyId, 'isBookmarked'],
    !isToggled
  )
  .setIn(
    ['entities', storyId, 'counts', 'bookmarks'],
    !isToggled ? numOfLikes - 1 : numOfLikes + 1
  )
}

export const receiveBookmarks = (state, {stories, myBookmarksById}) => {
  return state.merge({
    userBookmarksFetchStatus: {
      loaded: true,
      fetching: false
    },
    ...myBookmarksById,
    stories,
    error: null,
  }, {
    deep: true
  })
}

export const receiveBookmarksFailure = (state, {error}) => {
  return state.merge({error})
}

/* ------------- Selectors ------------- */

export const getByCategory = (storyEntities, categoryId) => {
  return _.filter(storyEntities, s => {
    return s.category === categoryId
  })
}

export const getByUser = (storyEntities, userId) => {
  return _.filter(storyEntities, s => {
    return s.author === userId
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEED_REQUEST]: request,
  [Types.FEED_SUCCESS]: receive,
  [Types.FEED_FAILURE]: failure,
  [Types.FROM_USER_REQUEST]: requestById,
  [Types.FROM_USER_SUCCESS]: receiveById,
  [Types.FROM_USER_FAILURE]: receiveByIdFailure,
  [Types.STORY_LIKE]: storyLike,
  [Types.STORY_LIKE_SUCCESS]: storyLikeSuccess,
  [Types.STORY_LIKE_FAILURE]: storyLikeFailure,
  [Types.STORY_BOOKMARK]: storyBookmark,
  [Types.STORY_BOOKMARK_SUCCESS]: storyBookmarkSuccess,
  [Types.STORY_BOOKMARK_FAILURE]: storyBookmarkFailure,
  [Types.GET_BOOKMARKS_SUCCESS]: receiveBookmarks,
  [Types.GET_BOOKMARKS_FAILURE]: receiveBookmarksFailure,
})
