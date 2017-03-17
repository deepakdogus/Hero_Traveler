import { call, put } from 'redux-saga/effects'
import StoryActions from '../Redux/StoryRedux'

export function * getUserFeed (api, action) {
  const { userId } = action
  const response = yield call(api.getUserFeed, userId)
  if (response.ok) {
    const { data: posts } = response;
    yield put(StoryActions.feedSuccess(posts))
  } else {
    yield put(StoryActions.feedFailure())
  }
}
