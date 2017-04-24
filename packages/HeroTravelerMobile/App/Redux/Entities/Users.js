import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadUser: ['userId'],
  loadUserSuccess: ['user'],
  loadUserFailure: null,
  loadUserSuggestionsRequest: null,
  loadUserSuggestionsSuccess: ['users'],
  loadUserSuggestionsFailure: null,
  updateUser: ['attrs'],
  updateUserSuccess: ['user'],
  updateUserFailure: ['error'],
  receiveUsers: ['users'],
  receiveLikes: ['userId', 'storyIds'],
  receiveBookmarks: ['userId', 'storyIds'],
  toggleLike: ['userId', 'storyId'],
  toggleBookmark: ['userId', 'storyId']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: {
    fetching: false,
    loaded: false,
  },
  usersLikesById: {},
  usersBookmarksById: {},
  usersStoriesById: {},
  error: null,
})

/* ------------- Reducers ------------- */

export const loadUser = (state) => {
  return state.setIn(
    ['fetchStatus', 'fetching'],
    true
  )
}
export const loadUserSuccess = (state, {user}) => {
  const path = ['entities', user.id]
  const updatedUser = state.getIn(path)
                           .merge(user, {deep: true})
  return state.setIn(path, updatedUser)
              .merge({error: null, fetchStatus: {fetching: false, loaded: true}})
}
export const loadUserFailure = (state, {error}) => {
  return state.merge({error, fetchStatus: {fetching: false, loaded: false}})
}
export const suggestions = (state) => {
  return state.setIn(
    ['fetchStatus', 'fetching'],
    true
  )
}
export const suggestionsSuccess = (state, {users = {}}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    entities: users
  }, {
    deep: true
  })
}
export const suggestionsFailure = (state) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: false
    },
    error: 'Error loading categories'
  })
}
export const receive = (state, {users = {}}) => {
  return state.merge({entities: users}, {deep: true})
}
export const updateUser = (state) => state.merge({
  error: null,
  updating: true
})
export const updateUserSuccess = (state, {user}) => {
  const path = ['entities', user.id]
  const updatedUser = state.getIn(path)
                           .merge(user, {deep: true})
  return state.setIn(path, updatedUser)
              .merge({error: null, updating: false})
}
export const updateUserFailure = (state, {error}) => {
  return state.merge({
    error,
    updating: false
  })
}
export const receiveLikes = (state, {userId, storyIds}) => state.setIn(
  ['usersLikesById', userId],
  storyIds
)
export const receiveBookmarks = (state, {userId, storyIds}) => state.setIn(
  ['usersBookmarksById', userId],
  storyIds
)

export const toggleLike = (state, {userId, storyId}) => {
  const likes = _.get(state, `usersLikesById.${userId}`, [])
  if (_.includes(likes, storyId)) {
    return state.setIn(
      ['usersLikesById', userId],
      _.without(likes, storyId)
    )
  } else {
    return state.setIn(
      ['usersLikesById', userId],
      likes.concat(storyId)
    )
  }
}

export const toggleBookmark = (state, {userId, storyId}) => {
  const likes = _.get(state, `usersBookmarksById.${userId}`, [])
  if (_.includes(likes, storyId)) {
    return state.setIn(
      ['usersBookmarksById', userId],
      _.without(likes, storyId)
    )
  } else {
    return state.setIn(
      ['usersBookmarksById', userId],
      likes.concat(storyId)
    )
  }
}

/* -------------        Selectors        ------------- */
export const isInitialAppDataLoaded = (state, userId) => {
  return _.every([
    _.has(state.usersLikesById, userId)
  ])
}

export const isStoryLiked = (state: object, userId: string, storyId: string) => {
  return _.includes(state.getIn(['usersLikesById', userId]), storyId)
}

export const isStoryBookmarked = (state: object, userId: string, storyId: string) => {
  return _.includes(state.getIn(['usersBookmarksById', userId]), storyId)
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_USER_SUGGESTIONS_REQUEST]: suggestions,
  [Types.LOAD_USER_SUGGESTIONS_SUCCESS]: suggestionsSuccess,
  [Types.LOAD_USER_SUGGESTIONS_FAILURE]: suggestionsFailure,
  [Types.LOAD_USER]: loadUser,
  [Types.LOAD_USER_SUCCESS]: loadUserSuccess,
  [Types.LOAD_USER_FAILURE]: loadUserFailure,
  [Types.UPDATE_USER]: updateUser,
  [Types.UPDATE_USER_SUCCESS]: updateUserSuccess,
  [Types.UPDATE_USER_FAILURE]: updateUserFailure,
  [Types.RECEIVE_USERS]: receive,
  [Types.RECEIVE_LIKES]: receiveLikes,
  [Types.RECEIVE_BOOKMARKS]: receiveBookmarks,
  [Types.TOGGLE_LIKE]: toggleLike,
  [Types.TOGGLE_BOOKMARK]: toggleBookmark,
})
