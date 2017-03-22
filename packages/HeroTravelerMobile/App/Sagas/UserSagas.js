import { call, put } from 'redux-saga/effects'
import UserActions from '../Redux/UserRedux'

export function * getSuggestedUsers (api, action) {
  const response = yield call(api.getSuggestedUsers)
  if (response.ok) {
    const { data: users } = response;
    yield put(UserActions.loadUserSuggestionsSuccess(users))
  } else {
    yield put(UserActions.loadUserSuggestionsFailure())
  }
}
