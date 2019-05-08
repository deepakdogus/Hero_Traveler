import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetTotalStats: ['payload'],
  adminGetTotalStatsSuccess: ['res'],
  adminGetTotalStatsFailure: null,
  adminGetNewStats: ['payload'],
  adminGetNewStatsSuccess: ['res'],
  adminGetNewStatsFailure: null,
})

export const AdminStatsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  total: {},
  totalIsLoading: true,
  newIsLoading: true,
  new: {},
})

/* ------------- Reducers ------------- */
export const adminGetTotalStatsSuccess = (state, { res }) => {
  return state.merge({
    ...state,
    total: res.data,
    totalIsLoading: false,
  },
  {
    deep: true
  })
}

export const adminGetNewStatsSuccess = (state, { res }) => {
  return state.merge({
    ...state,
    new: res.data,
    newIsLoading: false,
  },
  {
    deep: true
  })
}

export const adminGetTotalStatsFailure = (state) => {
  return state.setIn(
    ['totalIsLoading'], false)
}

export const adminGetNewStatsFailure = (state) => {
  return state.setIn(
    ['newIsLoading'], false)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_TOTAL_STATS_SUCCESS]: adminGetTotalStatsSuccess,
  [Types.ADMIN_GET_NEW_STATS_SUCCESS]: adminGetNewStatsSuccess,
  [Types.ADMIN_GET_TOTAL_STATS_FAILURE]: adminGetTotalStatsFailure,
  [Types.ADMIN_GET_NEW_STATS_FAILURE]: adminGetNewStatsFailure,
})

/* ------------- Selectors ------------- */

