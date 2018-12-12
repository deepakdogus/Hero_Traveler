import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetUsers: null,
  getUsersSuccess: ['data'],
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
    error: null
  }
})

/* ------------- Reducers ------------- */
// we're attempting to login
export const adminGetUsers = (state) => {

  return state.merge({
    users: {
      isLoading: true
    }
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

export const getUsersSuccess = (state, { data }) => {
  return state.merge({
    users: {
      list: data,
      total: data.length,
      isLoading: false,
      error: null
    }
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_USERS]: adminGetUsers,
  [Types.GET_USERS_FAILURE]: getUsersFailure,
  [Types.GET_USERS_SUCCESS]: getUsersSuccess,
})

/* ------------- Selectors ------------- */

