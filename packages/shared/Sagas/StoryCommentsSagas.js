import { call, put } from 'redux-saga/effects'
import StoryCommentsActions from '../Redux/Entities/StoryComments'

// attempts to signup with email
export function * getComments(api, {storyId}) {
  const response = yield call(api.getComments, storyId)

  if (response.ok) {
    yield put(StoryCommentsActions.getCommentsSuccess(response.data))
  } else {
    yield put(StoryCommentsActions.commentRequestFailure('get', 'Failed to get stories'))
  }
}

export function * createCommment(api, {storyId, text}) {
  const response = yield call(api.createComment, storyId, text)

  if (response.ok) {
    yield put(StoryCommentsActions.createCommentSuccess(response.data))
  } else {
    yield put(StoryCommentsActions.commentRequestFailure('create', 'Failed to get stories'))
  }
}

