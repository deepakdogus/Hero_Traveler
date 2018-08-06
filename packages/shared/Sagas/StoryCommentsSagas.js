import { call, put } from 'redux-saga/effects'
import StoryCommentsActions from '../Redux/Entities/StoryComments'
import StoryActions from '../Redux/Entities/Stories'

export function * getComments(api, {storyId}) {
  const response = yield call(api.getComments, storyId)

  if (response.ok) {
    yield put(StoryCommentsActions.getCommentsSuccess(response.data))
  } else {
    yield put(StoryCommentsActions.commentRequestFailure('get', 'Failed to get comments'))
  }
}

export function * createCommment(api, {storyId, text}) {
  const response = yield call(api.createComment, storyId, text)

  if (response.ok) {
    yield [
      put(StoryCommentsActions.createCommentSuccess(response.data)),
      put(StoryActions.changeCountOfType(storyId, 'comments', true))
    ]
  } else {
    yield put(StoryCommentsActions.commentRequestFailure('create', 'Failed to create comment'))
  }
}

