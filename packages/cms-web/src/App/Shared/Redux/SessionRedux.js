import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startInitializeSession: null,
  initializeSession: ['userId', 'tokens'],
  logout: ['tokens', 'deviceType'],
  logoutSuccess: ['deviceType'],
  logoutFailure: null,
  resetRootStore: null,
  resumeSession: ['userId', 'retrievedTokens'],
  resumeSessionFailure: ['error'],
  refreshSession: ['tokens'],
  refreshSessionSuccess: ['tokens'],
  clearError: null,
})

export const SessionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  tokens: null,
  userId: null,
  isSessionLoading: false,
  isLoggingOut: false,
  isLoggedOut: true,
  isResumingSession: true,
  error: null,
})

/* ------------- Reducers ------------- */
export const startInitializeSession = (state) => {
  return state.merge({
    isSessionLoading: true,
    error: null
  })
}
// we're attempting to login
export const initializeSession = (state, {userId, tokens}) => {

  return state.merge({
    userId,
    tokens,
    isLoggedOut: false,
    isResumingSession: false,
    isSessionLoading: false,
    error: null
  })
}

export const resumeSessionFailure = (state, { error }) => {
  return state.merge({
    isSessionLoading: false,
    error
  })
}

// we've attempted to logout
export const logout = (state) => state.merge({ isLoggingOut: true })

// notify the UI that we've logged out
// we reset the stores elsewhere completely
export const logoutSuccess = (state, {deviceType}) => {
  let update = {
      isLoggedOut: true,
      isLoggingOut: false
    }
  if (deviceType !== 'mobile') {
    update.tokens = null
    update.userId = null
  }
  return state.merge(update)
}

// We've somehow failed to logout, most probably because the server couldn't
// even find our access token. In any case, we should resume client side
// operation so that user can at least try to login again.
export const logoutFailure = (state) => state.merge({
  isLoggedOut: true,
  isLoggingOut: false
})

export const setIsResuming = (state, {isResuming}) => state.merge({
  isResumingSession: true,
  error: null,
})

export const refreshSessionSuccess = (state, {tokens}) => {
  return state.merge({
    tokens,
    isLoggingOut: false,
    error: null,
  })
}

export const resumeError = (state, {error}) => state.merge({
  isResumingSession: false,
  isSessionLoading: false,
  error
})

export const clearError = (state) => state.merge({ error: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.START_INITIALIZE_SESSION]: startInitializeSession,
  [Types.INITIALIZE_SESSION]: initializeSession,
  [Types.LOGOUT]: logout,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.RESUME_SESSION]: setIsResuming,
  [Types.RESUME_SESSION_FAILURE]: resumeError,
  [Types.REFRESH_SESSION_SUCCESS]: refreshSessionSuccess,
  [Types.CLEAR_ERROR]: clearError,
})

/* ------------- Selectors ------------- */

// Does the user have necessary info to make API requests?
export const hasAuthData: boolean = (sessionState) => {
  return !!sessionState.tokens && !!sessionState.userId
}
export const getUserId: string = (sessionState) => sessionState.userId
