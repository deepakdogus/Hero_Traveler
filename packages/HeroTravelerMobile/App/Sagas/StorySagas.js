import { call, put } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import UserActions from '../Redux/Entities/Users'
import StoryCreateActions from '../Redux/StoryCreateRedux'

export function * getUserFeed (api, action) {
  const { userId } = action
  const response = yield call(api.getUserFeed, userId)
  if (response.ok) {
    const { data: entities } = response;
    yield [
      put(StoryActions.feedSuccess(data.stories)),
      put(UserActions.receiveUsers(data.users)),
    ]
  } else {
    yield put(StoryActions.feedFailure())
  }
}

export function * getUserStories (api, {userId}) {
  const response = yield call(api.getUserStories, userId)
  if (response.ok) {
    const { data } = response;
    yield put(StoryActions.fromUserSuccess(data.stories)),
    yield put(StoryActions.receiveUsers(data.users)),
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
    yield put(StoryCreateActions.publishFailure(new Error('Failed to publish story')))
  }
}
