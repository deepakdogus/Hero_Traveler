import { call, put, select } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import UserActions, {isInitialAppDataLoaded, isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import CategoryActions from '../Redux/Entities/Categories'
import StoryCreateActions from '../Redux/StoryCreateRedux'
import {getNewCover, saveCover} from '../Redux/helpers/coverUpload'
import CloudinaryAPI from '../../Services/CloudinaryAPI'
import pathAsFileObject from '../Lib/pathAsFileObject'
import _ from 'lodash'
import Immutable from 'seamless-immutable'

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
    yield put(StoryActions.feedFailure(new Error('Failed to get feed')))
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

const extractUploadData = (uploadData) => {
  if (typeof uploadData === 'string') uploadData = JSON.parse(uploadData)
  return {
    url: `${uploadData.public_id}.${uploadData.format}`,
    height: uploadData.height,
    width: uploadData.width,
  }
}

function * createCover(api, draft){
  const isImageCover = draft.coverImage
  const cover = getNewCover(draft.coverImage, draft.coverVideo)
  if (!cover) return draft
  const cloudinaryCover = yield CloudinaryAPI.uploadMediaFile(cover, isImageCover ? 'image' : 'video')
  if (cloudinaryCover.error) return cloudinaryCover
  if (isImageCover) draft.coverImage = cloudinaryCover.data
  else draft.coverVideo = cloudinaryCover.data
  return draft
}

function * uploadAtomicAssets(draft){
  if (!draft.draftjsContent) return
  draft.draftjsContent = Immutable.asMutable(draft.draftjsContent, {deep: true})

  const promise = yield Promise.all(draft.draftjsContent.blocks.map((block, index) => {
    if (block.type === 'atomic') {
      const {url, type} = block.data
      if (url.substring(0,4) === 'file') {
        return CloudinaryAPI.uploadMediaFile(pathAsFileObject(url), type)
        .then(({data: imageUpload}) => {
          return _.merge(block.data, extractUploadData(imageUpload))
        })
        .catch(err => {
          return Promise.reject(err)
        })
      }
    }
    else return
  }))
  .catch(err => {
    return err
  })
  return promise
}

function * publishDraftErrorHandling(draft, response){
  let err = new Error('Failed to publish story')
  // TODO: I tried {...response, ...err} but that seemed to strip the Error instance of it's
  //       methods, maybe Object.assign(err, response) is better?
  err.status = response.status
  err.problem = response.problem

  yield put(StoryCreateActions.publishDraftFailure(err))
  // offline publishing handling
  const stories = {}
  stories[draft.id] = draft
  yield [
    put(StoryActions.receiveStories(stories)),
    put(StoryActions.addDraft(draft.id)),
    put(StoryActions.addBackgroundFailure(
      draft,
      'failed to publish',
      'publishLocalDraft',
    ))
  ]
  return err
}

function * updateDraftErrorHandling(draft, response){
  const err = new Error('Failed to update draft')
  err.status = response.status
  err.problem = response.problem
  yield [
    put(StoryCreateActions.updateDraftFailure(err)),
    put(StoryActions.addBackgroundFailure(
      draft,
      'failed to update',
      'updateDraft',
    ))
  ]
}

export function * publishLocalDraft (api, action) {
  const {draft} = action

  const coverResponse = yield createCover(api, draft)
  if (coverResponse.error) {
    yield publishDraftErrorHandling(draft, coverResponse.error)
    return
  }

  const atomicResponse = yield uploadAtomicAssets(draft)
  if (atomicResponse.error){
    yield publishDraftErrorHandling(draft, atomicResponse.error)
    return
  }
  yield put(StoryCreateActions.publishDraft(draft))
}

export function * publishDraft (api, action) {
  const {draft} = action
  const response = yield call(api.createStory, draft)
  if (response.ok) {
    const stories = {}
    const story = response.data.story
    story.author = story.author.id
    stories[story.id] = story
    yield [
      put(StoryCreateActions.publishDraftSuccess(draft)),
      put(StoryActions.addUserStory(stories, draft.id)),
    ]
    return
  } else yield publishDraftErrorHandling(draft, response)
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
  const coverResponse = yield createCover(api, draft)
  if (coverResponse.error) {
    yield updateDraftErrorHandling(draft, coverResponse.error)
    return
  }

  const atomicResponse = yield uploadAtomicAssets(draft)
  if (atomicResponse.error){
    yield updateDraftErrorHandling(draft, atomicResponse.error)
    return
  }

  const response = yield call(api.updateDraft, draftId, draft)
  if (response.ok) {
    const {entities, result} = response.data
    const story = entities.stories[result]
    if (updateStoryEntity || !story.draft) {
      yield put(StoryActions.receiveStories(entities.stories))
    }
    yield [
      put(StoryCreateActions.updateDraftSuccess(story)),
      put(StoryActions.removeBackgroundFailure(story.id)),
    ]
  } else yield updateDraftErrorHandling(draft, draftId)
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

export function * loadStory(api, {storyId, cachedStory}) {
  const response = yield call(
    api.getStory,
    storyId
  )

  if (response.ok) {
    const {entities, result} = response.data
    yield put(StoryCreateActions.editStorySuccess(entities.stories[result]))
  } else {
    yield put(StoryCreateActions.editStoryFailure(new Error('Failed to load story'), cachedStory))
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
