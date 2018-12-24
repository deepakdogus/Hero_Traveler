import { call, put } from 'redux-saga/effects'
import AdminActions from '../../Redux/Admin/Categories'

export function * adminGetCategories (api, action) {
  console.log('calling adminGetCategories saga', action)
  const { params } = action
  const response = yield call(api.adminGetCategories, params)
  if (response.ok && response.data && response.data.data) {
    const { data, count } = response.data
    yield put(AdminActions.adminGetCategoriesSuccess({ data, count }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetCategoriesFailure(error))
  }
}

export function * adminGetCategory (api, action) {
  console.log('calling adminGetCategory saga', action)
  const { id } = action
  const response = yield call(api.adminGetCategory, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetCategorySuccess({ record }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetCategoryFailure(error))
  }
}

export function * adminPutCategory (api, action) {
  console.log('calling adminPutCategory saga', action)
  const { values, id, resolve, reject } = action.payload
  const response = yield call(api.adminPutCategory, { values, id })
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetCategorySuccess({ record }))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminDeleteCategory (api, action) {
  console.log('calling adminDeleteCategory saga', action)
  const { id, resolve, reject } = action.payload
  const response = yield call(api.adminDeleteCategory, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminDeleteCategorySuccess(id))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminRestoreCategories (api, action) {
  console.log('calling adminRestoreCategories saga', action)
  const { ids, resolve, reject } = action.payload
  const response = yield call(api.adminRestoreCategories, ids)
  if (response.ok && response.data) {
    const record = response.data
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminUploadCategoryImage (api, action) {
  console.log('calling uploadImage saga', action)
  const { fileObj, resolve, reject } = action.payload
  const response = yield call(api.uploadGenericImage, fileObj)
  console.log('response', response)
  if (response.ok && response.data) {
    const record = response.data
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}
