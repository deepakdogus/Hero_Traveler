import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {is} from 'ramda'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initializeSession: ['user', 'tokens'],
  logout: ['tokens'],
  logoutSuccess: null,
  refreshUser: null,
  refreshUserSuccess: ['user'],
  refreshUserFailure: null,
  updateUser: ['attrs'],
  updateUserSuccess: ['user'],
  updateUserFailure: ['error'],
  receiveLikes: ['storyIds'],
  toggleLike: ['storyId'],
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  tokens: null,
  user: null,
  isLoggingOut: false,
  refreshingUser: false,
  updating: false,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const initializeSession = (state, {user, tokens}) => {
  return state.merge({ user, tokens })
}

// we've logged out
export const logout = (state) => state.merge({ isLoggingOut: true })

export const logoutSuccess = (state) => INITIAL_STATE

export const updateUser = (state) => state.merge({
  error: null,
  updating: true
})

export const updateUserSuccess = (state, {user}) =>
  state.merge({
    user,
    error: null,
    updating: false
  })

export const updateUserFailure = (state, {error}) =>
  state.merge({
    error,
    updating: false
  })

export const refreshUser = (state) =>
  state.merge({refreshingUser: true})

export const refreshUserSuccess = (state, {user}) =>
  state.merge({refreshingUser: false, user})

export const refreshUserFailure = (state) =>
  state.merge({refreshingUser: false})

export const receiveLikes = (state, {storyIds}) => state.setIn(
  ['likesById'],
  storyIds
)

export const toggleLike = (state, {storyId}) => {
  const likes = _.get(state, 'likesById', [])
  if (_.includes(likes, storyId)) {
    return state.setIn(
      ['likesById'],
      _.without(likes, storyId)
    )
  } else {
    return state.setIn(
      ['likesById'],
      likes.concat(storyId)
    )
  }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZE_SESSION]: initializeSession,
  [Types.LOGOUT]: logout,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.REFRESH_USER]: refreshUser,
  [Types.UPDATE_USER]: updateUser,
  [Types.UPDATE_USER_SUCCESS]: updateUserSuccess,
  [Types.UPDATE_USER_FAILURE]: updateUserFailure,
  [Types.REFRESH_USER_SUCCESS]: refreshUserSuccess,
  [Types.REFRESH_USER_FAILURE]: refreshUserFailure,
  [Types.RECEIVE_LIKES]: receiveLikes,
  [Types.TOGGLE_LIKE]: toggleLike,
})

/* ------------- Selectors ------------- */

// Does the user have necessary info to make API requests?
export const hasAuthData: boolean = (sessionState) => sessionState.tokens && is(Object, sessionState.user)
export const getUserId: string = (sessionState) => _.get(sessionState, 'user.id')
export const isInitialAppDataLoaded: boolean = (sessionState) => _.every([
  _.has(sessionState, 'likesById'),
  // _.has(user, 'bookmarksById'),
  // _.has(user, 'followingById'),
])
export const isStoryLiked = (sessionState, storyId) => _.includes(sessionState.likesById, storyId)