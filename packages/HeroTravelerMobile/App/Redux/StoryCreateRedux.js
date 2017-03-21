import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  publishRequest: ['story'],
  publishSuccess: ['story'],
  publishFailure: ['error']
})

export const StoryCreateTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  story: {},
  publishing: false,
  error: null,
  isCreated: false
})

/* ------------- Reducers ------------- */

// request the temperature for a city
export const request = (state, { userId }) => {
  return state.merge({publishing: true});
}
// successful temperature lookup
export const success = (state, {story}) => {
  return state.merge({publishing: false, error: null, story, isCreated: true})
}

// failed to get the temperature
export const failure = (state, {error}) =>
  state.merge({publishing: false, error})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PUBLISH_REQUEST]: request,
  [Types.PUBLISH_SUCCESS]: success,
  [Types.PUBLISH_FAILURE]: failure
})

export const isCreated = (state) => state.isCreated
