import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetGuides: ['params'],
  adminGetGuidesSuccess: ['res'],
  adminGetGuidesFailure: ['error'],
  adminGetGuide: ['id'],
  adminGetGuideSuccess: ['res'],
  adminGetGuideFailure: ['error'],
  adminPutGuide: ['payload'],
  adminDeleteGuide: ['payload'],
  adminDeleteGuideSuccess: ['id'],
  adminRestoreGuides: ['payload'],
})

export const AdminGuideTypes = Types
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


export const adminGetGuides = (state, { params = {} }) => {
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

export const adminGetGuidesFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false
  })
}

export const adminGetGuidesSuccess = (state, { res }) => {
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

export const adminGetGuide = (state, { params = {} }) => {
  return state.setIn(['isLoading'], true)
}


export const adminGetGuideFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false
  })
}


export const adminGetGuideSuccess = (state, { res }) => {
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

export const adminDeleteGuideSuccess = (state, { id }) => {
  let list = [...state.getIn(['list'])]
  let total = state.getIn(['total'])
  const index = findIndex(list, { id })
  return state.setIn(['list', index, 'isDeleted'], true)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_GUIDES]: adminGetGuides,
  [Types.ADMIN_GET_GUIDES_FAILURE]: adminGetGuidesFailure,
  [Types.ADMIN_GET_GUIDES_SUCCESS]: adminGetGuidesSuccess,
  [Types.ADMIN_GET_GUIDE]: adminGetGuide,
  [Types.ADMIN_GET_GUIDE_FAILURE]: adminGetGuideFailure,
  [Types.ADMIN_GET_GUIDE_SUCCESS]: adminGetGuideSuccess,
  [Types.ADMIN_DELETE_GUIDE_SUCCESS]: adminDeleteGuideSuccess,
})

/* ------------- Selectors ------------- */

