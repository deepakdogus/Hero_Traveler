import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetUsers: ['params'],
  getUsersSuccess: ['res'],
  getUsersFailure: ['error'],
  adminGetUser: ['id'],
  adminGetUserSuccess: ['res'],
  adminGetUserFailure: ['error']
})

export const AdminTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  users: {
    isLoading: false,
    list: [],
    total: 0,
    error: null,
    params: {
      page: 1,
      limit: 5
    }
  }
})

/* ------------- Reducers ------------- */
export const adminGetUsers = (state, { params = {} }) => {
  return state.merge({
    users: {
      isLoading: true,
      params: {
        ...state.users.params,
        ...params
      }
    }
  }, {
    deep: true
  })
}

export const getUsersFailure = (state, { error }) => {
  return state.merge({
    users: {
      error,
      isLoading: false
    }
  })
}

export const getUsersSuccess = (state, { res }) => {
  return state.merge({
    users: {
      ...state.users,
      list: res.data,
      total: res.count,
      isLoading: false,
      error: null
    }
  },
  {
    deep: true
  })
}

export const adminGetUser = (state, { params = {} }) => {
  return state.setIn(['users', 'isLoading'], true)
}

export const adminGetUserFailure = (state, { error }) => {
  return state.merge({
    users: {
      error,
      isLoading: false
    }
  })
}

export const adminGetUserSuccess = (state, { res }) => {
  let list = [...state.getIn(['users', 'list'])]
  let total = state.getIn(['users', 'total'])
  const userIndex = findIndex(list, { id: res.id })
  console.log('userIndex', list, userIndex)
  if (userIndex >= 0) {
    list[userIndex] = res.record
  } else {
    list.push(res.record)
    total = total + 1
  }
  return state.merge({
    users: {
      ...state.users,
      list,
      total,
      isLoading: false,
      error: null
    }
  },
  {
    deep: true
  })
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_USERS]: adminGetUsers,
  [Types.GET_USERS_FAILURE]: getUsersFailure,
  [Types.GET_USERS_SUCCESS]: getUsersSuccess,
  [Types.ADMIN_GET_USER]: adminGetUser,
  [Types.ADMIN_GET_USER_FAILURE]: adminGetUserFailure,
  [Types.ADMIN_GET_USER_SUCCESS]: adminGetUserSuccess,
})

/* ------------- Selectors ------------- */

