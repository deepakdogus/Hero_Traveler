import { call, put } from 'redux-saga/effects'
import AdminActions from '../../Redux/Admin/Stats'

export function * adminGetTotalStats (api, action) {
  const { resolve, reject } = action.payload
  const response = yield call(api.adminGetTotalStats)
  if (response.ok && response.data) {
    const { data } = response
    yield put(AdminActions.adminGetTotalStatsSuccess({ data }))
    return resolve(data)
  }
 else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminGetNewStats (api, action) {
  const { params, resolve, reject } = action.payload
  const response = yield call(api.adminGetNewStats, params)
  if (response.ok && response.data) {
    const { data } = response
    yield put(AdminActions.adminGetNewStatsSuccess({ data }))
    return resolve(data)
  }
 else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}