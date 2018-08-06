import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: [],
  loginFailure: ['error'],
  loginFacebook: null,
  loginFacebookSuccess: ['username'],
  loginFacebookFailure: ['error'],
  resetPasswordRequest: ['email'],
  resetPasswordRequestSuccess: [],
  resetPasswordRequestFailure: ['error'],
  resetPassword: ['token', 'password'],
  resetPasswordSuccess: null,
  resetPasswordFailure: ['error'],
  setIsLoggedIn: ['isLoggedIn'],
  verifyEmail: ['token'],
  verifyEmailFailure: ['error'],
  clearErrors: null,
  changePasswordRequest: ['userId', 'oldPassword', 'newPassword'],
  changePasswordSuccess: [],
  changePasswordFailure: ['error'],
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: null,
  fetching: false,
  isLoggedIn: false
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state) =>
  state.merge({fetching: false, error: null})

// SUCCESS: facebook
export const successFacebook = (state, { username }) =>
  state.merge({fetching: false, error: null})

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error })

// we're attempting to find user who requested PW reset
export const requestReset = (state) => state

// success: found user requesting PW reset
export const successRequestReset = (state) => state

// success: did not find user requesting PW reset
export const failureRequestReset = (state) => state

export const resetPasswordFailure = (state, { error }) =>
  state.merge({ fetching: false, error: "Could NOT reset your password. Please try again." })


export const setIsLoggedIn = (state, {isLoggedIn}) => state.merge({isLoggedIn})

export const clearErrors = (state) => state.merge({ error: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGIN_FACEBOOK]: request,
  [Types.LOGIN_FACEBOOK_SUCCESS]: successFacebook,
  [Types.LOGIN_FACEBOOK_FAILURE]: failure,
  [Types.RESET_PASSWORD_REQUEST]: requestReset,
  [Types.RESET_PASSWORD_REQUEST_SUCCESS]: successRequestReset,
  [Types.RESET_PASSWORD_REQUEST_FAILURE]: failureRequestReset,
  [Types.RESET_PASSWORD_FAILURE]: resetPasswordFailure,
  [Types.SET_IS_LOGGED_IN]: setIsLoggedIn,
  [Types.VERIFY_EMAIL_FAILURE]: failure,
  [Types.CLEAR_ERRORS]: clearErrors,
  [Types.CHANGE_PASSWORD_REQUEST]: request,
  [Types.CHANGE_PASSWORD_SUCCESS]: success,
  [Types.CHANGE_PASSWORD_FAILURE]: failure,
})
