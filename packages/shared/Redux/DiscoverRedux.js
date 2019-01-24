import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {fetching, fetchingError, fetchingSuccess} from './helpers/fetchStatus'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchChannels: null,
  fetchChannelsSuccess: ['channels'],
  fetchChannelsFaliure: ['error'],
  fetchCategories: null,
  fetchCategoriesSuccess: ['categories'],
  fetchCategoriesFaliure: ['error'],
})

export const DiscoverTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  channels: {
    data: [],
    isFetching: false,
    error: null
  },
  categories: {
    data: [],
    isFetching: false,
    error: null
  }
})

/* ------------- Reducers ------------- */
export const fetchChannels = (state) => {
  return state.setIn(['channels'], {isFetching: fetching()})
}

export const fetchChannelsSuccess = (state, {channels}) => {
  return state.setIn(['channels'], {isFetching: fetchingSuccess(), data: channels})
}

export const fetchChannelsFailure = (state, {error}) => {
  return state.setIn(['channels'], {isFetching: fetchingError(), error})
}

export const fetchCategories = (state) => {
  return state.setIn(['categories'], {isFetching: fetching()})
}

export const fetchCategoriesSuccess = (state, {categories}) => {
  return state.setIn(['categories'], {isFetching: fetchingSuccess(), data: categories})
}

export const fetchCategoriesFailure = (state, {error}) => {
  return state.setIn(['categories'], {isFetching: fetchingError(), error})
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_CHANNELS]: fetchChannels,
  [Types.FETCH_CHANNELS_SUCCESS]: fetchChannelsSuccess,
  [Types.FETCH_CHANNELS_FAILURE]: fetchChannelsFailure,
  [Types.FETCH_CATEGORIES]: fetchCategories,
  [Types.FETCH_CATEGORIES_SUCCESS]: fetchCategoriesSuccess,
  [Types.FETCH_CATEGORIES_FAILURE]: fetchCategoriesFailure,
})
