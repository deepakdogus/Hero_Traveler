import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initializeSession: ['userId', 'tokens'],
  logout: ['tokens'],
  logoutSuccess: null,
  resetRootStore: null,
  resumeSession: null,
  resumeSessionFailure: ['error'],
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  tokens: null,
  userId: null,
  isLoggingOut: false,
  isLoggedOut: true,
  isResumingSession: false,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const initializeSession = (state, {userId, tokens}) => {
  return state.merge({
    userId,
    tokens,
    isLoggedOut: false,
    isResumingSession: false
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

export const setIsResuming = (state, {isResuming}) => state.merge({
  isResumingSession: isResuming
})

export const resumeError = (state, {error}) => state.merge({isResuming: false, error})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZE_SESSION]: initializeSession,
  [Types.LOGOUT]: logout,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.RESUME_SESSION]: setIsResuming,
  [Types.RESUME_SESSION_FAILURE]: resumeError,

})

/* ------------- Selectors ------------- */

// Does the user have necessary info to make API requests?
export const hasAuthData: boolean = (sessionState) => {
  // console.log('hasAuthData', !!sessionState.tokens, !!sessionState.userId)
  return sessionState.tokens && sessionState.userId
}
export const getUserId: string = (sessionState) => sessionState.userId

