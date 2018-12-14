import { call, put } from 'redux-saga/effects'
import AdminActions from '../Redux/AdminRedux'

export function * adminGetUsers (api, action) {
  console.log('calling adminGetUsers saga', action)
  const { params } = action
  const response = yield call(api.adminGetUsers, params)
  if (response.ok && response.data && response.data.data) {
    const { data, count } = response.data;
    yield put(AdminActions.getUsersSuccess({ data, count }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.getUsersFailure(error))
  }
}

export function * adminGetUser (api, action) {
  console.log('calling adminGetUser saga', action)
  const { id } = action
  const response = yield call(api.adminGetUser, id)
  if (response.ok && response.data) {
    const record = response.data;
    yield put(AdminActions.adminGetUserSuccess({ record }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.adminGetUserFailure(error))
  }
}
