import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadCategoriesRequest: null,
  loadCategoriesSuccess: ['categories'],
  loadCategoriesFailure: null,
  receiveCategories: ['categories'],
  adminGetCategories: ['params'],
  adminGetCategoriesSuccess: ['res'],
  adminGetCategoriesFailure: ['error'],
  adminGetCategory: ['id'],
  adminGetCategorySuccess: ['res'],
  adminGetCategoryFailure: ['error'],
  adminPutCategory: ['payload'],
  adminPutCategoryFailure: null,
  adminDeleteCategory: ['payload'],
  adminDeleteCategorySuccess: ['id'],
  adminDeleteCategoryFailure: ['error'],
  adminRestoreCategories: ['payload'],
  adminPostCategory: ['payload'],
})

export const CategoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */
const initialFetchStatus = () => ({
  fetching: false,
  loaded: false,
})

export const INITIAL_STATE = Immutable({
  entities: {},
  fetchStatus: initialFetchStatus(),
  error: null,
  adminCategories: {
    fetchStatus: initialFetchStatus(),
    byId: [],
    total: 0,
    error: null,
    isDeleting: false,
    isUpdating: false,
    params: {
      page: 1,
      limit: 5
    }
  }
})

/* ------------- Reducers ------------- */

export const request = (state) => {
  return Immutable.setIn(
    state,
    ['fetchStatus', 'fetching'],
    true
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
    entities: categories
  }, {
    deep
  })
}

export const receive = (state, {categories = {}}) => {
  return state.merge({
    entities: categories
  }, {
    deep: true
  })
}

export const failure = (state) =>
  state.merge({fetching: false, error: true})


export const adminGetCategories = (state, { params = {} }) => {
  return state
    .setIn(
      ['adminCategories', 'fetchStatus'],
      {
        fetching: true,
        loaded: false
      })
    .setIn(
      ['adminCategories', 'params'],
      {
        ...state.adminCategories.params,
        ...params
      })
}

export const adminGetCategoriesFailure = (state, { error }) => {
  return state
    .setIn(
      ['adminCategories', 'fetchStatus'],
      {
        fetching: false,
        loaded: false
      })
    .setIn(
      ['adminCategories', 'error'],
      error)
}

export const adminGetCategoriesSuccess = (state, { res }) => {
  return state
    .setIn(
      ['adminCategories', 'byId'],
      res.data)
    .setIn(
      ['adminCategories', 'total'],
      res.count)
    .setIn(
      ['adminCategories', 'fetchStatus'],
      {
        fetching: false,
        loaded: true
      })
    .setIn(
      ['adminCategories', 'error'],
      null)
}

export const adminGetCategory = (state, { params = {} }) => {
  return state.setIn(['adminCategories', 'fetchStatus', 'fetching'], true)
}

export const adminGetCategoryFailure = (state, { error }) => {
  return state
    .setIn(
      ['adminCategories', 'fetchStatus'],
      {
        fetching: false,
        loaded: false
      })
    .setIn(
      ['adminCategories', 'error'],
      error)
}


export const adminGetCategorySuccess = (state, { res }) => {
  let list = [...state.getIn(['adminCategories', 'byId'])]
  let total = state.getIn(['adminCategories', 'total'])
  const { record } = res
  const recordIndex = _.findIndex(list, { id: record.id })
  if (recordIndex >= 0) {
    list[recordIndex] = record
  } else {
    list.push(record)
    total = total + 1
  }
  return state
    .setIn(
      ['adminCategories', 'byId'],
      list)
    .setIn(
      ['adminCategories', 'total'],
      total)
    .setIn(
      ['adminCategories', 'fetchStatus'],
      {
        fetching: false,
        loaded: true
      })
    .setIn(
      ['adminCategories', 'error'],
      null)
    .setIn(
      ['adminCategories', 'isUpdating'],
      false)
}


export const adminDeleteCategory = (state) => {
  return state.setIn(['adminCategories', 'isDeleting'], true)
}

export const adminDeleteCategoryFailure = (state) => {
  return state.setIn(['adminCategories', 'isDeleting'], false)
}

export const adminDeleteCategorySuccess = (state, { id }) => {
  const list = [...state.getIn(['adminCategories', 'byId'])]
  const recordIndex = _.findIndex(list, { id })
    
  return state.setIn(['adminCategories', 'byId', recordIndex, 'isDeleted'], true)
    .setIn(['adminCategories', 'isDeleting'], false)
}

export const adminPutCategory = (state) => {
  return state.setIn(['adminCategories', 'isUpdating'], true)
}

export const adminPutCategoryFailure = (state) => {
  return state.setIn(['adminCategories', 'isUpdating'], false)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_CATEGORIES_REQUEST]: request,
  [Types.LOAD_CATEGORIES_SUCCESS]: loadSuccess,
  [Types.LOAD_CATEGORIES_FAILURE]: failure,
  [Types.RECEIVE_CATEGORIES]: receive,
  [Types.ADMIN_GET_CATEGORIES]: adminGetCategories,
  [Types.ADMIN_GET_CATEGORIES_FAILURE]: adminGetCategoriesFailure,
  [Types.ADMIN_GET_CATEGORIES_SUCCESS]: adminGetCategoriesSuccess,
  [Types.ADMIN_GET_CATEGORY]: adminGetCategory,
  [Types.ADMIN_GET_CATEGORY_FAILURE]: adminGetCategoryFailure,
  [Types.ADMIN_GET_CATEGORY_SUCCESS]: adminGetCategorySuccess,
  [Types.ADMIN_DELETE_CATEGORY]: adminDeleteCategory,
  [Types.ADMIN_DELETE_CATEGORY_FAILURE]: adminDeleteCategoryFailure,
  [Types.ADMIN_DELETE_CATEGORY_SUCCESS]: adminDeleteCategorySuccess,
  [Types.ADMIN_PUT_CATEGORY]: adminPutCategory,
  [Types.ADMIN_PUT_CATEGORY_FAILURE]: adminPutCategoryFailure,
})
