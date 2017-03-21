import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  feedRequest: ['userId'],
  feedSuccess: ['posts'],
  feedFailure: null,
  fromUserRequest: ['userId'],
  fromUserSuccess: ['posts'],
  fromUserFailure: null,
})

export const StoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  posts: [],
  fetching: null,
  error: null,
})

/* ------------- Reducers ------------- */

// request the temperature for a city
export const request = (state, { userId }) => {
  return state.merge({fetching: true});
}
// successful temperature lookup
export const success = (state, action) => {
  const { posts } = action;
  return state.merge({ fetching: false, error: null, posts })
}

// failed to get the temperature
export const failure = (state) =>
  state.merge({ fetching: false, error: true, avatar: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEED_REQUEST]: request,
  [Types.FEED_SUCCESS]: success,
  [Types.FEED_FAILURE]: failure,
  [Types.FROM_USER_REQUEST]: request,
  [Types.FROM_USER_SUCCESS]: success,
  [Types.FROM_USER_FAILURE]: failure,
})
