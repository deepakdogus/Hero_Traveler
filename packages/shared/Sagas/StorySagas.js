import { call, put, select } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import UserActions, {isInitialAppDataLoaded, isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import CategoryActions from '../Redux/Entities/Categories'
import StoryCreateActions from '../Redux/StoryCreateRedux'

const hasInitialAppDataLoaded = ({entities}, userId) => isInitialAppDataLoaded(entities.users, userId)
const isStoryLikedSelector = ({entities}, userId, storyId) => isStoryLiked(entities.users, userId, storyId)
const isStoryBookmarkedSelector = ({entities}, userId, storyId) => isStoryBookmarked(entities.users, userId, storyId)

function * getInitalData(api, userId) {
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
      return yield [
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
}

export function * getUserFeed (api, action) {
  const { userId } = action

  // See if we need to load likes and bookmark info

  yield getInitalData(api, userId)

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

export function * getLikesAndBookmarks (api, {userId}){
  yield getInitalData(api, userId)
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
    yield put(StoryActions.getBookmarksFailure(userId, new Error('Failed to get bookmarks')))
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
    yield put(StoryActions.fromCategoryFailure(categoryId, new Error('Failed to get stories for category')))
  }
}

export function * publishDraft (api, action) {
  const {draft} = action
  const response = yield call(api.createStory, draft)
  if (response.ok) {
    yield put(StoryCreateActions.publishDraftSuccess(draft))
  } else {
    let err = new Error('Failed to publish story')
    // TODO: I tried {...response, ...err} but that seemed to strip the Error instance of it's
    //       methods, maybe Object.assign(err, response) is better?
    err.status = response.status
    err.problem = response.problem
    console.log(`Err ${response.problem} with status ${response.status}`)
    yield put(StoryCreateActions.publishDraftFailure(err))
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
    const story = entities.stories[result]
    if (updateStoryEntity || !story.draft) {
      yield put(StoryActions.receiveStories(entities.stories))
    }
    yield put(StoryCreateActions.updateDraftSuccess(story))
  } else {
    const err = new Error('Failed to update draft')
    err.status = response.status
    err.problem = response.problem
    yield put(StoryCreateActions.updateDraftFailure(err))
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

export function * flagStory(api, {userId, storyId}) {
  const response = yield call(
    api.flagStory,
    storyId,
  )
  if (response.ok) {
    yield [
      put(StoryActions.deleteStorySuccess(userId, storyId))
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


export function * getStory (api , {storyId}) {
  const response = yield call(api.getStory, storyId)

  if (response.ok) {
    const {entities} = response.data
    yield [
      put(StoryActions.receiveStories(entities.stories)),
      put(UserActions.receiveUsers(entities.users))
    ]
  } else {
    const errorObj = {}
    errorObj[storyId] = {
      error: 'Story not found'
    }
    yield put(StoryActions.receiveStories(errorObj))
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
