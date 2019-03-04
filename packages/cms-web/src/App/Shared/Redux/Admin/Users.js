import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetUsers: ['params'],
  adminGetUsersSuccess: ['res'],
  adminGetUsersFailure: ['error'],
  adminGetUser: ['id'],
  adminGetUserSuccess: ['res'],
  adminGetUserFailure: ['error'],
  adminPutUser: ['payload'],
  adminDeleteUser: ['payload'],
  adminDeleteUserSuccess: ['id'],
  adminRestoreUsers: ['payload'],
})

export const AdminUserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isLoading: false,
  list: [],
  total: 0,
  error: null,
  params: {
    page: 1,
    limit: 5,
  },
})

/* ------------- Reducers ------------- */
export const adminGetUsers = (state, { params = {} }) => {
  return state.merge({
    isLoading: true,
    params: {
      ...state.params,
      ...params,
    },
  }, {
    deep: true,
  })
}

export const adminGetUsersFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false,
  })
}

export const adminGetUsersSuccess = (state, { res }) => {
  return state.merge({
    ...state,
    list: res.data,
    total: res.count,
    isLoading: false,
    error: null,
  },
  {
    deep: true,
  })
}

export const adminGetUser = (state, { params = {} }) => {
  return state.setIn(['isLoading'], true)
}

export const adminGetUserFailure = (state, { error }) => {
  return state.merge({
    error,
    isLoading: false,
  })
}

export const adminGetUserSuccess = (state, { res }) => {
  let list = [...state.getIn(['list'])]
  let total = state.getIn(['total'])
  const { record } = res
  const userIndex = findIndex(list, { id: record.id })
  if (userIndex >= 0) {
    list[userIndex] = record
  }
 else {
    list.push(record)
    total = total + 1
  }
  return state.merge({
    ...state,
    list,
    total,
    isLoading: false,
    error: null,
  },
  {
    deep: true,
  })
}

export const adminDeleteUserSuccess = (state, { id }) => {
  const list = [...state.getIn(['list'])]
  const userIndex = findIndex(list, { id })
    
  return state.setIn(['list', userIndex, 'isDeleted'], true)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_USERS]: adminGetUsers,
  [Types.ADMIN_GET_USERS_FAILURE]: adminGetUsersFailure,
  [Types.ADMIN_GET_USERS_SUCCESS]: adminGetUsersSuccess,
  [Types.ADMIN_GET_USER]: adminGetUser,
  [Types.ADMIN_DELETE_USER_SUCCESS]: adminDeleteUserSuccess,
  [Types.ADMIN_GET_USER_FAILURE]: adminGetUserFailure,
  [Types.ADMIN_GET_USER_SUCCESS]: adminGetUserSuccess,
})

/* ------------- Selectors ------------- */
