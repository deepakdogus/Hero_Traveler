import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadUserSuggestionsRequest: null,
  loadUserSuggestionsSuccess: ['users'],
  loadUserSuggestionsFailure: null,
  receiveUsers: ['users'],
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: {
    fetching: false,
    loaded: false,
  },
  error: null,
})

/* ------------- Reducers ------------- */

export const request = (state) => {
  return Immutable.setIn(
    state,
    ['fetchStatus', 'fetching'],
    true
  )
}

export const receive = (state, {users}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    entities: users
  })
}

export const failure = (state) =>
  state.merge({
    fetchStatus: {
      fetching: false,
      loaded: false
    },
    error: 'Error loading categories'
  })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_USER_SUGGESTIONS_REQUEST]: request,
  [Types.LOAD_USER_SUGGESTIONS_SUCCESS]: receive,
  [Types.LOAD_USER_SUGGESTIONS_FAILURE]: failure,
  [Types.RECEIVE_USERS]: receive,
})
