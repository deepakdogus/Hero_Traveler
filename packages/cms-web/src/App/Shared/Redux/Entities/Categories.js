import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadCategoriesRequest: null,
  loadCategoriesSuccess: ['categories'],
  loadCategoriesFailure: null,
  receiveCategories: ['categories'],
})

export const CategoryTypes = Types
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

// so that we clear categories in case default Categories got switched
let firstLoad = false

export const loadSuccess = (state, {categories = {}}) => {
  const deep = firstLoad
  firstLoad = true

  return state.merge({
    fetchStatus: {
      fetching: false,
      loaded: true,
    },
    error: null,
    entities: categories,
  }, {
    deep,
  })
}

export const receive = (state, {categories = {}}) => {
  return state.merge({
    entities: categories,
  }, {
    deep: true,
  })
}

export const failure = (state) =>
  state.merge({fetching: false, error: true})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_CATEGORIES_REQUEST]: request,
  [Types.LOAD_CATEGORIES_SUCCESS]: loadSuccess,
  [Types.LOAD_CATEGORIES_FAILURE]: failure,
  [Types.RECEIVE_CATEGORIES]: receive,
})
