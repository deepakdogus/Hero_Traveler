import _ from 'lodash'
import { call, put, select } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import UserActions from '../Redux/Entities/Users'
import StoryCreateActions, {getDraft} from '../Redux/StoryCreateRedux'

export function * getUserFeed (api, action) {
  const { userId } = action
  const response = yield call(api.getUserFeed, userId)
  if (response.ok) {
    const { data } = response;
    yield [
      put(UserActions.receiveUsers(data.users)),
      put(StoryActions.feedSuccess(data.stories)),
    ]
  } else {
    yield put(StoryActions.feedFailure())
  }
}

export function * getUserStories (api, {userId}) {
  const response = yield call(api.getUserStories, userId)
  if (response.ok) {
    const { entities, result } = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(StoryActions.fromUserSuccess(entities.stories, {userStoriesById: result})),
    ]
  } else {
    yield put(StoryActions.fromUserFailure())
  }
}

export function * publishDraft (api, action) {
  const draft = yield select(getDraft)
  const response = yield call(api.createStory, draft)
  if (response.ok) {
    const {data: story} = response
    yield put(StoryCreateActions.publishDraftSuccess(story))
  } else {
    yield put(StoryCreateActions.publishDraftFailure(new Error('Failed to publish story')))
  }
}

export function * registerDraft (api, action) {
  const response = yield call(api.createDraft)
  if (response.ok) {
    const {data: draft} = response
    yield put(StoryCreateActions.registerDraftSuccess(draft))
  } else {
    yield put(StoryCreateActions.registerDraftFailure(new Error('Failed to initialize draft')))
  }
}

export function * discardDraft (api, action) {
  const {draftId} = action
  const response = yield call(api.removeDraft, draftId)
  if (response.ok) {
    yield put(StoryCreateActions.discardDraftSuccess())
  } else {
    yield put(StoryCreateActions.discardDraftFailure(new Error('Failed to initialize draft')))
  }
}

export function * updateDraft (api, action) {
  const {draftId, draft} = action
  console.log('draft', action)
  const response = yield call(api.updateDraft, draftId, draft)
  if (response.ok) {
    const {data: draft} = response
    yield put(StoryCreateActions.updateDraftSuccess(draft))
  } else {
    yield put(StoryCreateActions.updateDraftFailure(new Error('Failed to update draft')))
  }
}

export function * likeStory(api, {storyId}) {
  const response = yield call(
    api.likeStory,
    storyId
  )

  if (response.ok) {
    yield [
      put(StoryActions.storyLikeSuccess())
    ]
  } else {
    yield put(StoryActions.storyLikeFailure(storyId))
  }
}

export function * bookmarkStory(api, {storyId}) {
  const response = yield call(
    api.bookmarkStory,
    storyId
  )

  if (response.ok) {
    yield [
      put(StoryActions.storyBookmarkSuccess())
    ]
  } else {
    yield put(StoryActions.storyBookmarkFailure(storyId))
  }
}

export function * getBookmarks(api) {
  const response = yield call(
    api.getBookmarks
  )

  if (response.ok) {
    const {entities, result} = response.data
    const myBookmarksById = _.map(entities.bookmarks, b => {
      console.log(b)
      return b.story
    })

    console.log('myBookmarksById 2', myBookmarksById)
    yield put(StoryActions.getBookmarksSuccess(entities.stories, {myBookmarksById}))
  } else {
    yield put(StoryActions.getBookmarksFailure(new Error('Failed to get bookmarks')))
  }
}
