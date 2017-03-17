import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signupEmail: ['fullName', 'username', 'email', 'password'],
  signupEmailSuccess: null,
  signupEmailFailure: ['error']
})

export const SignupTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  error: null,
  fetching: false,
  signedUp: false
})

/* ------------- Reducers ------------- */
export const signupEmail = (state) => state.merge({fetching: true})

export const signupEmailSuccess = (state) =>
  state.merge({fetching: false, error: null, signedUp: true})

export const failure = (state, { error }) =>
  state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGNUP_EMAIL]: signupEmail,
  [Types.SIGNUP_EMAIL_SUCCESS]: signupEmailSuccess,
  [Types.SIGNUP_EMAIL_FAILURE]: failure
})

export const hasSignedUp = (signupState) => signupState.signedUp
