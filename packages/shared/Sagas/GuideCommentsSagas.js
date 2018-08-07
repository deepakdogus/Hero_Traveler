import {call, put} from 'redux-saga/effects'
import GuideCommentsActions from '../Redux/Entities/GuideComments'
import GuideActions from '../Redux/Entities/Guides'

export function * getGuideComments(api, {guideId}) {
  const response = yield call(api.getGuideComments,guideId)

  if(response.ok){
    yield put(GuideCommentsActions.getGuidesCommentsSuccess(response.data))
  } else {
    yield put (GuideCommentsActions.commentGuidesRequestFailure('get', 'Failed to get comments'))
  }
}

export function * createGuideComment(api, {guideId, text}) {
  const response = yield call(api.createGuideComment, guideId, text)

  if(response.ok) {
    yield [
      put(GuideCommentsActions.createGuidesCommentSuccess(response.data)),
      put(GuideActions.changeCountOfType(guideId, 'comments', true))
    ]
  } else {
    yield put(GuideCommentsActions.commentGuidesRequestFailure('create', 'Failed to create comment'))
  }
}