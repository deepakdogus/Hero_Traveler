import { call, put } from 'redux-saga/effects'
import AdminActions from '../../Redux/Admin/Stories'

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

export function * adminGetStory (api, action) {
  console.log('calling adminGetStory saga', action)
  const { id } = action
  const response = yield call(api.adminGetStory, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetStorySuccess({ record }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetStoryFailure(error))
  }
}

export function * adminPutStory (api, action) {
  console.log('calling adminPutStory saga', action)
  const { values, id, resolve, reject } = action.payload
  const response = yield call(api.adminPutStory, { values, id })
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminGetStorySuccess({ record }))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminDeleteStory (api, action) {
  console.log('calling adminDeleteStory saga', action)
  const { id, resolve, reject } = action.payload
  const response = yield call(api.adminDeleteStory, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(AdminActions.adminDeleteStorySuccess(id))
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}

export function * adminRestoreStories (api, action) {
  console.log('calling adminRestoreStories saga', action)
  const { usernames, resolve, reject } = action.payload
  const response = yield call(api.adminRestoreStories, usernames)
  if (response.ok && response.data) {
    const record = response.data
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}