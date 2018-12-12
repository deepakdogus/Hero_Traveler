import { call, put } from 'redux-saga/effects'
import AdminActions from '../Redux/AdminRedux'

export function * adminGetUsers (api, action) {
  console.log('calling adminGetUsers saga')
  const response = yield call(api.adminGetUsers)
  if (response.ok) {
    const list = response.data;
    yield put(AdminActions.getUsersSuccess(list))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(AdminActions.getUsersFailure(error))
  }
}
