import _ from 'lodash'
import { call, put, select } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import UserActions, {isInitialAppDataLoaded, isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import CategoryActions from '../Redux/Entities/Categories'
import StoryCreateActions from '../Redux/StoryCreateRedux'

const hasInitialAppDataLoaded = ({entities}, userId) => isInitialAppDataLoaded(entities.users, userId)
const isStoryLikedSelector = ({entities}, userId, storyId) => isStoryLiked(entities.users, userId, storyId)
const isStoryBookmarkedSelector = ({entities}, userId, storyId) => isStoryBookmarked(entities.users, userId, storyId)

export function * getUserFeed (api, action) {
  const { userId } = action

  // See if we need to load likes and bookmark info
  const initialAppDataLoaded = yield select(hasInitialAppDataLoaded, userId)
  if (!initialAppDataLoaded) {
    const [
      likesResponse,
      bookmarksResponse,
      followingResponse
    ] = yield [
      call(api.getUserLikes, userId),
      call(api.getBookmarks, userId),
      call(api.getUserFollowing, userId),
    ]
    if (likesResponse.ok && bookmarksResponse.ok && followingResponse.ok) {
      const {result: followingById, entities: followingEntities} = followingResponse.data
      const {result: bookmarksById, entities: bookmarkEntities} = bookmarksResponse.data
      yield [
        put(UserActions.receiveUsers({
          ...bookmarkEntities.users,
          ...followingEntities.users
        })),
        put(UserActions.loadUserFollowingSuccess(userId, followingById)),
        put(CategoryActions.receiveCategories(bookmarkEntities.categories)),
        put(StoryActions.receiveStories(bookmarkEntities.stories)),
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
    yield put(StoryActions.fromUserFailure(userId, new Error('Failed to get stories for user')))
  }
}

export function * getBookmarks(api, {userId}) {
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
      put(UserActions.receiveBookmarks(userId, result)),
      put(StoryActions.getBookmarksSuccess(userId, result)),
    ]
  } else {
    yield put(StoryActions.getBookmarksFailure(new Error('Failed to get bookmarks')))
  }
}

export function * getCategoryStories (api, {categoryId, storyType}) {
  const response = yield call(api.getCategoryStories, categoryId, {type: storyType})
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
  const {draftId, draft, updateStoryEntity} = action
  const response = yield call(api.updateDraft, draftId, draft)
  if (response.ok) {
    const {entities, result} = response.data
    if (updateStoryEntity) {
      yield put(StoryActions.receiveStories(entities.stories))
    }
    yield put(StoryCreateActions.updateDraftSuccess(entities.stories[result]))
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

export function * likeStory(api, {userId, storyId}) {
  const [wasLiked, response] = yield [
    select(isStoryLikedSelector, userId, storyId),
    call(api.likeStory, storyId)
  ]

  yield [
    put(UserActions.userToggleLike(userId, storyId)),
    put(StoryActions.toggleLike(storyId, wasLiked)),
  ]

  if (!response.ok) {
    yield [
      put(UserActions.userToggleLike(userId, storyId)),
      put(StoryActions.toggleLike(storyId, !wasLiked)),
    ]
  }
}

export function * bookmarkStory(api, {userId, storyId}) {
  const [wasLiked, response] = yield [
    select(isStoryBookmarkedSelector, userId, storyId),
    call(
      api.bookmarkStory,
      storyId
    )
  ]

  yield [
    put(UserActions.userToggleBookmark(userId, storyId)),
    put(StoryActions.toggleBookmark(storyId, wasLiked))
  ]

  if (!response.ok) {
    yield [
      put(UserActions.userToggleBookmark(userId, storyId)),
      put(StoryActions.toggleBookmark(storyId, !wasLiked))
    ]
  }
}

export function * loadStory(api, {storyId}) {
  const response = yield call(
    api.getStory,
    storyId
  )

  if (response.ok) {
    const {entities, result} = response.data
    yield put(StoryCreateActions.editStorySuccess(entities.stories[result]))
  } else {
    yield put(StoryCreateActions.editStoryFailure(new Error('Failed to load story')))
  }
}

export function * loadDrafts(api) {
  const response = yield call(
    api.getDrafts
  )

  if (response.ok) {
    const {entities, result} = response.data
    yield [
      put(StoryActions.receiveStories(entities.stories)),
      put(StoryActions.receiveStories(entities.categories)),
    ]
    yield put(StoryActions.loadDraftsSuccess(result))
  } else {
    yield put(StoryActions.loadDraftsFailure(new Error('Failed to load drafts')))
  }
}

export function * deleteStory(api, {userId, storyId}){
  const response = yield call(
    api.deleteStory,
    storyId
  )

  if (response.ok) {
    yield put(StoryActions.deleteStorySuccess(userId, storyId))
  } 
}
