import {all, call, put} from 'redux-saga/effects'
import CommentActions from '../Redux/Entities/Comments'
import StoryActions from '../Redux/Entities/Stories'
import GuideActions from '../Redux/Entities/Guides'

export function *getComments(api, {feedItemId, entityType}) {
  const response = entityType === 'story'
  ? yield call(api.getComments, feedItemId)
  : yield call(api.getGuideComments, feedItemId)

  if (response.ok) {
    yield put(CommentActions.getCommentsSuccess(response.data, feedItemId, entityType))
  } else {
    yield put(CommentActions.commentRequestFailure('get', 'Failed to get comments'))
  }
}

export function *createComment(api, {feedItemId, entityType, text}) {
  const response = entityType === 'story'
  ? yield call(api.createComment, feedItemId, text)
  : yield call(api.createGuideComment, feedItemId, text)

  const changeCount = entityType === 'story'
  ? StoryActions.changeCountOfType
  : GuideActions.changeCountOfType

  if (response.ok) {
    yield all([
      put(CommentActions.createCommentSuccess(response.data, feedItemId, entityType)),
      put(changeCount(feedItemId, 'comments', true))
    ])
  } else {
    yield put(CommentActions.commentRequestFailure('get', 'Failed to create comment'))
  }
}
