import { call, put } from 'redux-saga/effects'
import AdminActions from '../Redux/AdminRedux'

export function * adminGetUsers (api, action) {
  console.log('calling adminGetUsers saga', action)
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
  console.log('calling adminGetUser saga', action)
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

export function * adminGetStories (api, action) {
  console.log('calling adminGetStories saga', action)
  const { params } = action
  const response = yield call(api.adminGetStories, params)
  if (response.ok && response.data && response.data.data) {
    const { data, count } = response.data
    yield put(AdminActions.adminGetStoriesSuccess({ data, count }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetStoriesFailure(error))
  }
}

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

