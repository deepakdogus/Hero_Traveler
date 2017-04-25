import { call, put } from 'redux-saga/effects'
import UserActions from '../Redux/Entities/Users'

export function * getSuggestedUsers (api, action) {
  const response = yield call(api.getSuggestedUsers)
  if (response.ok) {
    const { data } = response;
    yield put(UserActions.receiveUsers(data.users))
  } else {
    yield put(UserActions.loadUserSuggestionsFailure())
  }
}

export function * loadUser (api, {userId}) {
  const response = yield call(api.getUser, userId)
  if (response.ok) {
    const { data } = response;
    console.log('loadUser response', response)
    yield put(UserActions.receiveUsers(data.users))
  } else {
    yield put(UserActions.loadUserSuggestionsFailure())
  }
}