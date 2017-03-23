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
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  tokens: null,
  user: null,
  isLoggingOut: false,
  refreshingUser: false
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const initializeSession = (state, {user, tokens}) => {
  return state.merge({ user, tokens })
}

// we've logged out
export const logout = (state) => state.merge({ isLoggingOut: true })

export const logoutSuccess = (state) => INITIAL_STATE

export const refreshUser = (state) =>
  state.merge({refreshingUser: true})

export const refreshUserSuccess = (state, {user}) =>
  state.merge({refreshingUser: false, user})

export const refreshUserFailure = (state) =>
  state.merge({refreshingUser: false, user})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZE_SESSION]: initializeSession,
  [Types.LOGOUT]: logout,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.REFRESH_USER]: refreshUser,
  [Types.REFRESH_USER_SUCCESS]: refreshUserSuccess,
  [Types.REFRESH_USER_FAILURE]: refreshUserFailure,
})

/* ------------- Selectors ------------- */

// Does the user have necessary info to make API requests?
export const hasAuthData = (sessionState) => sessionState.tokens && is(Object, sessionState.user)
