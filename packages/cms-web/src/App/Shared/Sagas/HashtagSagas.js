import { call, put } from 'redux-saga/effects'
import HashtagActions from '../Redux/Entities/Hashtags'

export function * getHashtags (api, action) {
  const response = yield call(api.getHashtags)
  if (response.ok) {
    const { entities } = response.data;
    yield put(HashtagActions.loadHashtagsSuccess(entities.hashtags))
  } else {
    yield put(HashtagActions.loadHashtagsFailure())
  }
}
