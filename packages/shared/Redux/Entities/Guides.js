import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createGuide: ['guide'],
  receiveGuides: ['guides'],
  createGuideFailure: ['error'],
})

export const GuideTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: {
    fetching: false,
    loaded: false,
  },
  error: null
})

/* ------------- Reducers ------------- */

export const request = (state) => {
  return Immutable.setIn(
    state,
    ['fetchStatus', 'fetching'],
    true
  )
}

export const receiveGuides = (state, {guides = {}}) => {
  return state.merge({entities: guides}, {deep: true})
}

export const failure = (state, {error}) =>
  state.merge({fetching: false, error})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_GUIDE]: request,
  [Types.RECEIVE_GUIDES]: receiveGuides,
  [Types.CREATE_GUIDE_FAILURE]: failure,
})
