import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetCategories: ['params'],
  adminGetCategoriesSuccess: ['res'],
  adminGetCategoriesFailure: ['error'],
  adminGetCategory: ['id'],
  adminGetCategorySuccess: ['res'],
  adminGetCategoryFailure: ['error'],
  adminPutCategory: ['payload'],
  adminDeleteCategory: ['payload'],
  adminDeleteCategorySuccess: ['id'],
  adminRestoreCategories: ['payload'],
})

export const AdminCategoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isLoading: false,
  list: [],
  total: 0,
  error: null,
  params: {
    page: 1,
    limit: 5
  }
})


export const adminGetCategories = (state, { params = {} }) => {
  return state.merge({
    isLoading: true,
    params: {
      ...state.params,
      ...params
    }
  }, {
    deep: true
  })
}

export const adminGetCategoriesFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false
  })
}

export const adminGetCategoriesSuccess = (state, { res }) => {
  return state.merge({
    ...state,
    list: res.data,
    total: res.count,
    isLoading: false,
    error: null
  },
  {
    deep: true
  })
}

export const adminGetCategory = (state, { params = {} }) => {
  return state.setIn(['isLoading'], true)
}


export const adminGetCategoryFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false
  })
}


export const adminGetCategorySuccess = (state, { res }) => {
  let list = [...state.getIn(['list'])]
  let total = state.getIn(['total'])
  const { record } = res
  const index = findIndex(list, { id: record.id })
  if (index >= 0) {
    list[index] = record
  } else {
    list.push(record)
    total = total + 1
  }
  return state.merge({
    ...state,
    list,
    total,
    isLoading: false,
    error: null
  },
  {
    deep: true
  })
}

export const adminDeleteCategorySuccess = (state, { id }) => {
  let list = [...state.getIn(['list'])]
  let total = state.getIn(['total'])
  const index = findIndex(list, { id })
  list.splice(index, 1);
  total = total - 1
  return state.merge({
    ...state,
    list,
    total,
    isLoading: false,
    error: null
  },
  {
    deep: true
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_CATEGORIES]: adminGetCategories,
  [Types.ADMIN_GET_CATEGORIES_FAILURE]: adminGetCategoriesFailure,
  [Types.ADMIN_GET_CATEGORIES_SUCCESS]: adminGetCategoriesSuccess,
  [Types.ADMIN_GET_CATEGORY]: adminGetCategory,
  [Types.ADMIN_GET_CATEGORY_FAILURE]: adminGetCategoryFailure,
  [Types.ADMIN_GET_CATEGORY_SUCCESS]: adminGetCategorySuccess,
  [Types.ADMIN_DELETE_CATEGORY_SUCCESS]: adminDeleteCategorySuccess,
})

/* ------------- Selectors ------------- */

