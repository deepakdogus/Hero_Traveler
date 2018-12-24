import { call, put } from 'redux-saga/effects'
import AdminActions from '../../Redux/Admin/Guides'

export function * adminGetGuides (api, action) {
  console.log('calling adminGetGuides saga', action)
  const { params } = action
  const response = yield call(api.adminGetGuides, params)
  if (response.ok && response.data && response.data.data) {
    const { data, count } = response.data
    yield put(AdminActions.adminGetGuidesSuccess({ data, count }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetGuidesFailure(error))
  }
}

export function * adminGetGuide (api, action) {
  console.log('calling adminGetGuide saga', action)
  const { id } = action
  const response = yield call(api.adminGetGuide, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetGuideSuccess({ record }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetGuideFailure(error))
  }
}

export function * adminPutGuide (api, action) {
  console.log('calling adminPutGuide saga', action)
  const { values, id, resolve, reject } = action.payload
  const response = yield call(api.adminPutGuide, { values, id })
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetGuideSuccess({ record }))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminDeleteGuide (api, action) {
  console.log('calling adminDeleteGuide saga', action)
  const { id, resolve, reject } = action.payload
  const response = yield call(api.adminDeleteGuide, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminDeleteGuideSuccess(id))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminRestoreGuides (api, action) {
  console.log('calling adminRestoreGuides saga', action)
  const { ids, resolve, reject } = action.payload
  const response = yield call(api.adminRestoreGuides, ids)
  if (response.ok && response.data) {
    const record = response.data
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}