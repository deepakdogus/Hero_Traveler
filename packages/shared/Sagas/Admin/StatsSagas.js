import { call, put } from 'redux-saga/effects'
import AdminActions from '../../Redux/Admin/Stats'

export function * adminGetTotalStats (api, action) {
  const { message } = action.payload
  const response = yield call(api.adminGetTotalStats)
  if (response.ok && response.data) {
    const { data } = response
    yield put(AdminActions.adminGetTotalStatsSuccess({ data }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
    yield put(AdminActions.adminGetTotalStatsFailure())
  }
}

export function * adminGetNewStats (api, action) {
  const { params, message } = action.payload
  const response = yield call(api.adminGetNewStats, params)
  if (response.ok && response.data) {
    const { data } = response
    yield put(AdminActions.adminGetNewStatsSuccess({ data }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
    yield put(AdminActions.adminGetNewStatsFailure())
  }
}