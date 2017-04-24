import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {is} from 'ramda'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initializeSession: ['userId', 'tokens'],
  logout: ['tokens'],
  logoutSuccess: null,
  // refreshUser: null,
  // refreshUserSuccess: ['user'],
  // refreshUserFailure: null,
  // updateUser: ['attrs'],
  // updateUserSuccess: ['user'],
  // updateUserFailure: ['error'],
  // receiveLikes: ['storyIds'],
  // toggleLike: ['storyId'],
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  tokens: null,
  userId: null,
  isLoggingOut: false,
  // refreshingUser: false,
  // updating: false,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const initializeSession = (state, {userId, tokens}) => {
  return state.merge({ userId, tokens })
}

// we've logged out
export const logout = (state) => state.merge({ isLoggingOut: true })

export const logoutSuccess = (state) => INITIAL_STATE

// export const refreshUser = (state) =>
//   state.merge({refreshingUser: true})

// export const refreshUserSuccess = (state, {user}) =>
//   state.merge({refreshingUser: false, user})

// export const refreshUserFailure = (state) =>
//   state.merge({refreshingUser: false})



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZE_SESSION]: initializeSession,
  [Types.LOGOUT]: logout,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  // [Types.REFRESH_USER]: refreshUser,
  // [Types.REFRESH_USER_SUCCESS]: refreshUserSuccess,
  // [Types.REFRESH_USER_FAILURE]: refreshUserFailure,
  // [Types.RECEIVE_LIKES]: receiveLikes,
  // [Types.TOGGLE_LIKE]: toggleLike,
})

/* ------------- Selectors ------------- */

// Does the user have necessary info to make API requests?
export const hasAuthData: boolean = (sessionState) => sessionState.tokens && sessionState.userId
export const getUserId: string = (sessionState) => sessionState.userId
// export const isInitialAppDataLoaded: boolean = (sessionState) => _.every([
//   _.has(sessionState, 'likesById'),
//   _.has(user, 'bookmarksById'),
//   _.has(user, 'followingById'),
// ])
