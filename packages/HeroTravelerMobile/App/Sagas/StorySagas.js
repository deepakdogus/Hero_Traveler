import _ from 'lodash'
import { call, put, select } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import UserActions, {isInitialAppDataLoaded} from '../Redux/Entities/Users'
import CategoryActions from '../Redux/Entities/Categories'
import {getUserId, isStoryLiked} from '../Redux/SessionRedux'
import StoryCreateActions, {getDraft} from '../Redux/StoryCreateRedux'

const isStoryLikedSelector = ({session}, storyId) => isStoryLiked(session, storyId)
const hasInitialAppDataLoaded = ({entities}, userId) => isInitialAppDataLoaded(entities.users, userId)

export function * getUserFeed (api, action) {
  const { userId } = action

  // See if we need to load likes and bookmark info
  const initialAppDataLoaded = yield select(hasInitialAppDataLoaded, userId)
  if (!initialAppDataLoaded) {
    const [likesResponse, bookmarksResponse] = yield [
      call(api.getUserLikes, userId),
      call(api.getBookmarks, userId)
    ]
    if (likesResponse.ok && bookmarksResponse.ok) {
      const {result: bookmarksById, entities} = bookmarksResponse.data
      yield [
        put(UserActions.receiveUsers(entities.users)),
        put(CategoryActions.receiveCategories(entities.categories)),
        put(StoryActions.receiveStories(entities.stories)),
        put(UserActions.receiveLikes(userId, likesResponse.data)),
        put(UserActions.receiveBookmarks(userId, bookmarksById)),
      ]
    }
  }

  const response = yield call(api.getUserFeed, userId)

  if (response.ok) {
    const { entities, result } = response.data;
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(CategoryActions.receiveCategories(entities.categories)),
      put(StoryActions.receiveStories(entities.stories)),
      put(StoryActions.feedSuccess(result)),
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
      put(CategoryActions.receiveCategories(entities.categories)),
      put(StoryActions.receiveStories(entities.stories)),
      put(StoryActions.fromUserSuccess(userId, result)),
    ]
  } else {
    yield put(StoryActions.fromUserFailure(new Error('Failed to get stories for user')))
  }
}

export function * getCategoryStories (api, {categoryId}) {
  const response = yield call(api.getCategoryStories, categoryId)
  if (response.ok) {
    const { entities, result } = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(CategoryActions.receiveCategories(entities.categories)),
      put(StoryActions.receiveStories(entities.stories)),
      put(StoryActions.fromCategorySuccess(categoryId, result)),
    ]
  } else {
    yield put(StoryActions.fromCategoryFailure(new Error('Failed to get stories for category')))
  }
}

export function * publishDraft (api, action) {
  const {draft} = action
  const response = yield call(api.createStory, draft)
  if (response.ok) {
    const {data: story} = response
    yield put(StoryCreateActions.publishDraftSuccess(draft))
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
  const {draftId, draft, resetAfterUpdate} = action
  const response = yield call(api.updateDraft, draftId, draft)
  if (response.ok) {
    const {data: draft} = response
    yield put(StoryCreateActions.updateDraftSuccess(draft, resetAfterUpdate))
  } else {
    yield put(StoryCreateActions.updateDraftFailure(new Error('Failed to update draft')))
  }
}

export function * uploadCoverImage(api, action) {
  const {draftId, path} = action
  const response = yield call(api.uploadCoverImage, draftId, path)
  if (response.ok) {
    const {data: draft} = response
    yield put(StoryCreateActions.uploadCoverImageSuccess(draft))
  } else {
    yield put(StoryCreateActions.uploadCoverImageFailure(new Error('Failed to upload cover image')))
  }
}

export function * likeStory(api, {storyId}) {
  const response = yield call(api.likeStory, storyId)

  yield [
    put(UserActions.toggleLike(storyId)),
    put(StoryActions.toggleLike(storyId)),
  ]

  if (!response.ok) {
    yield [
      put(UserActions.toggleLike(storyId)),
      put(StoryActions.toggleLike(storyId)),
    ]
  }
}

export function * bookmarkStory(api, {storyId}) {
  const response = yield call(
    api.bookmarkStory,
    storyId
  )

  yield [
    put(UserActions.toggleBookmark()),
    put(StoryActions.toggleBookmark())
  ]

  if (!response.ok) {
    yield [
      put(UserActions.toggleBookmark()),
      put(StoryActions.toggleBookmark())
    ]
  }
}

export function * getBookmarks(api) {
  const response = yield call(
    api.getBookmarks,
    userId
  )

  if (response.ok) {
    const {entities, result} = response.data

    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(CategoryActions.receiveCategories(entities.categories)),
      put(StoryActions.receiveStories(entities.stories)),
      put(UserActions.receiveBookmarks(userId, result))
    ]
  } else {
    yield put(StoryActions.getBookmarksFailure(new Error('Failed to get bookmarks')))
  }
}
