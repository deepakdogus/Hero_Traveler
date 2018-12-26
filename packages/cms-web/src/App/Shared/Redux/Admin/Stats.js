import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import findIndex from 'lodash/findIndex'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  adminGetTotalStats: ['payload'],
  adminGetTotalStatsSuccess: ['res'],
  adminGetNewStats: ['payload'],
  adminGetNewStatsSuccess: ['res'],
})

export const AdminStatsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  total: {},
  new: {},
})

/* ------------- Reducers ------------- */
export const adminGetTotalStatsSuccess = (state, { res }) => {
  return state.merge({
    ...state,
    total: res.data,
  },
  {
    deep: true
  })
}

export const adminGetNewStatsSuccess = (state, { res }) => {
  return state.merge({
    ...state,
    new: res.data,
  },
  {
    deep: true
  })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADMIN_GET_TOTAL_STATS_SUCCESS]: adminGetTotalStatsSuccess,
  [Types.ADMIN_GET_NEW_STATS_SUCCESS]: adminGetNewStatsSuccess,
})

/* ------------- Selectors ------------- */

