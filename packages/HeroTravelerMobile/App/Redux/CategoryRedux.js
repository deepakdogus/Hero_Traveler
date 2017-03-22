import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadCategoriesRequest: null,
  loadCategoriesSuccess: ['categories'],
  loadCategoriesFailure: null,
})

export const CategoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  categories: [],
  fetching: null,
  error: null,
})

/* ------------- Reducers ------------- */

export const request = (state) => {
  return state.merge({fetching: true})
}

export const success = (state, {categories}) => {
  return state.merge({ fetching: false, error: null, categories})
}

export const failure = (state) =>
  state.merge({fetching: false, error: true})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_CATEGORIES_REQUEST]: request,
  [Types.LOAD_CATEGORIES_SUCCESS]: success,
  [Types.LOAD_CATEGORIES_FAILURE]: failure,
})
