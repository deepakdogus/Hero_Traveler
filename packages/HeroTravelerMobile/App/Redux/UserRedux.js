import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadUserSuggestionsRequest: null,
  loadUserSuggestionsSuccess: ['users'],
  loadUserSuggestionsFailure: null,
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  users: [],
  fetching: null,
  error: null,
})

/* ------------- Reducers ------------- */

export const request = (state) => {
  return state.merge({fetching: true})
}

export const success = (state, {users}) => {
  return state.merge({ fetching: false, error: null, users})
}

export const failure = (state) =>
  state.merge({fetching: false, error: true})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_USER_SUGGESTIONS_REQUEST]: request,
  [Types.LOAD_USER_SUGGESTIONS_SUCCESS]: success,
  [Types.LOAD_USER_SUGGESTIONS_FAILURE]: failure,
})
