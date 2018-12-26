import { call, put } from 'redux-saga/effects'
import AdminActions from '../../Redux/Admin/Users'

export function * adminGetUsers (api, action) {
  const { params } = action
  const response = yield call(api.adminGetUsers, params)
  if (response.ok && response.data && response.data.data) {
    const { data, count } = response.data
    yield put(AdminActions.adminGetUsersSuccess({ data, count }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetUsersFailure(error))
  }
}

export function * adminGetUser (api, action) {
  const { id } = action
  const response = yield call(api.adminGetUser, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetUserSuccess({ record }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetUserFailure(error))
  }
}

export function * adminPutUser (api, action) {
  const { values, id, resolve, reject } = action.payload
  const response = yield call(api.adminPutUser, { values, id })
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetUserSuccess({ record }))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminDeleteUser (api, action) {
  const { id, resolve, reject } = action.payload
  const response = yield call(api.adminDeleteUser, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminDeleteUserSuccess(id))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminRestoreUsers (api, action) {
  const { usernames, resolve, reject } = action.payload
  const response = yield call(api.adminRestoreUsers, usernames)
  if (response.ok && response.data) {
    const record = response.data
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminUploadUserHeroImage (api, action) {
  const { fileObj, category, resolve, reject } = action.payload
  const response = yield call(api.adminUploadUserHeroImage, fileObj, category)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetUserSuccess({ record }))
    return resolve(response)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}


export function * adminUploadUserChannelImage (api, action) {
  const { fileObj, category, resolve, reject } = action.payload
  const response = yield call(api.adminUploadUserChannelImage, fileObj, category)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetUserSuccess({ record }))
    return resolve(response)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}
