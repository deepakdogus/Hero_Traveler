import { call, put } from 'redux-saga/effects'
import StoryActions from '../Redux/StoryRedux'
import StoryCreateActions from '../Redux/StoryCreateRedux'

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

export function * getUserStories (api, {userId}) {
  const response = yield call(api.getUserStories, userId)
  if (response.ok) {
    const { data: posts } = response;
    yield put(StoryActions.fromUserSuccess(posts))
  } else {
    yield put(StoryActions.fromUserFailure())
  }
}

export function * createPhotoStory (api, action) {
  const {story} = action
  const response = yield call(api.createStory, story)
  if (response.ok) {
    const {data: story} = response
    yield put(StoryCreateActions.publishSuccess(story))
  } else {
    console.log('Publish error response', response)
    yield put(StoryCreateActions.publishFailure(new Error('Failed to publish story')))
  }
}
