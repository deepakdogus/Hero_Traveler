import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: ['user', 'token'],
  loginFailure: ['error'],
  loginFacebook: null,
  loginFacebookSuccess: ['username'],
  loginFacebookFailure: ['error']
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  token: null,
  userId: null,
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state, { user, token }) =>
  state.merge({ fetching: false, error: null, user, token })

// SUCCESS: facebook
export const successFacebook = (state, { username }) =>
  state.merge({fetching: false, error: null, username: 'rwoody'})

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGIN_FACEBOOK]: request,
  [Types.LOGIN_FACEBOOK_SUCCESS]: successFacebook,
  [Types.LOGIN_FACEBOOK_FAILURE]: failure
})
