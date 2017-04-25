import _ from 'lodash'
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {is} from 'ramda'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initializeSession: ['userId', 'tokens'],
  logout: ['tokens'],
  logoutSuccess: null,
  resetRootStore: null
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  tokens: null,
  userId: null,
  isLoggingOut: false,
  isLoggedOut: true
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const initializeSession = (state, {userId, tokens}) => {
  return state.merge({
    userId,
    tokens,
    isLoggedOut: false,
  })
}

// we've attempted to logout
export const logout = (state) => state.merge({ isLoggingOut: true })

// notify the UI that we've logged out
// we reset the stores elsewhere completely
export const logoutSuccess = (state) => state.merge({
  isLoggedOut: true,
  isLoggingOut: false
})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZE_SESSION]: initializeSession,
  [Types.LOGOUT]: logout,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
})

/* ------------- Selectors ------------- */

// Does the user have necessary info to make API requests?
export const hasAuthData: boolean = (sessionState) => sessionState.tokens && sessionState.userId
export const getUserId: string = (sessionState) => sessionState.userId

