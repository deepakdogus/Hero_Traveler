import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetUsers: ['params'],
  getUsersSuccess: ['res'],
  getUsersFailure: ['error']
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
// we're attempting to login
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

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_USERS]: adminGetUsers,
  [Types.GET_USERS_FAILURE]: getUsersFailure,
  [Types.GET_USERS_SUCCESS]: getUsersSuccess,
})

/* ------------- Selectors ------------- */

