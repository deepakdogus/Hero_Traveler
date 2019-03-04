import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadHashtagsRequest: null,
  loadHashtagsSuccess: ['hashtags'],
  loadHashtagsFailure: null,
  receiveHashtags: ['hashtags'],
})

export const HashtagTypes = Types
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
    true,
  )
}

export const loadSuccess = (state, {hashtags = {}}) => {
  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    entities: hashtags,
  }, {
    deep: true,
  })
}

export const receive = (state, {hashtags = {}}) => {
  return state.merge({
    entities: hashtags,
  }, {
    deep: true,
  })
}

export const failure = (state) =>
  state.merge({fetching: false, error: true})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_HASHTAGS_REQUEST]: request,
  [Types.LOAD_HASHTAGS_SUCCESS]: loadSuccess,
  [Types.LOAD_HASHTAGS_FAILURE]: failure,
  [Types.RECEIVE_HASHTAGS]: receive,
})
