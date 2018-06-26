import { call, put, select } from 'redux-saga/effects'
import StoryActions from '../Redux/Entities/Stories'
import GuideActions from '../Redux/Entities/Guides'
import UserActions, {isInitialAppDataLoaded, isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import CategoryActions from '../Redux/Entities/Categories'
import StoryCreateActions from '../Redux/StoryCreateRedux'
import {getNewCover, saveCover} from '../Redux/helpers/coverUpload'
import CloudinaryAPI from '../../Services/CloudinaryAPI'
import pathAsFileObject from '../Lib/pathAsFileObject'
import _ from 'lodash'
import Immutable from 'seamless-immutable'

function * createCover(api, guide){
  const isImageCover = guide.coverImage
  const cover = getNewCover(guide.coverImage, guide.coverVideo)
  if (!cover) return guide
  const cloudinaryCover = yield CloudinaryAPI.uploadMediaFile(cover, isImageCover ? 'image' : 'video')
  if (cloudinaryCover.error) return cloudinaryCover
  cloudinaryCover.data = JSON.parse(cloudinaryCover.data)
  if (isImageCover) guide.coverImage = cloudinaryCover.data
  else guide.coverVideo = cloudinaryCover.data
  return guide
}

export function * createGuide(api, {guide, userId}) {
  const coverResponse = yield createCover(api, guide)
  // add error handling here
  const response = yield call(api.createGuide, guide)
  if (response.ok) {
    const {guides} = response.data.entities
    yield [
      put(GuideActions.receiveGuides(guides)),
      put(GuideActions.createGuideSuccess(guides, userId)),
    ]
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed to create guide")
    ))
  }
}


export function * getGuide(api, {guideId}) {
  const response = yield call(api.getGuide, guideId)
  if (response.ok) {
    const {guides, users} = response.data.entities
    yield [
      put(UserActions.receiveUsers(users)),
      put(GuideActions.receiveGuides(guides)),
    ]
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed to get guide")
    ))
  }
}

export function * updateGuide(api, {guide}) {
  const coverResponse = yield createCover(api, guide)
  // add error handling
  const response = yield call(api.updateGuide, guide)
  if (response.ok) {
    const {guides} = response.data.entities
    yield put(GuideActions.receiveGuides(guides))
  }
  // add error handling for fail
}

export function * deleteGuide(api, {guideId, userId}) {
  const response = yield call(api.deleteGuide, guideId)
  if (response.ok) {
    yield put(GuideActions.deleteGuideSuccess(guideId, userId))
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed to delete guide")
    ))
  }
}

export function * getUserGuides(api, {userId}) {
  const response = yield call(api.getUserGuides, userId)
  if (response.ok) {
    const {guides} = response.data.entities
    yield [
      put(GuideActions.receiveGuides(guides)),
      put(GuideActions.receiveUsersGuides(guides, userId)),
    ]
  }
  // add error handling for fail
}

export function * getUserFeedGuides(api, {userId}) {
  const response = yield call(api.getUserFeedGuides, userId)
  if (response.ok) {
    const { entities, result } = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(CategoryActions.receiveCategories(entities.categories)),
      put(GuideActions.receiveGuides(entities.guides)),
      put(GuideActions.guideFeedSuccess(result)),
    ]
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed get user's feed guides")
    ))
  }
}

export function * getCategoryGuides(api, {categoryId}) {
  const response = yield call(api.getCategoryGuides, categoryId)
  if (response.ok) {
    const {entities, result} = response.data
    yield [
      put(UserActions.receiveUsers(entities.users)),
      put(CategoryActions.receiveCategories(entities.categories)),
      put(GuideActions.receiveGuides(entities.guides)),
      put(GuideActions.getCategoryGuidesSuccess(categoryId, result))
    ]
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed to get category's guides")
    ))
  }
}

export function * bulkSaveStoryToGuide(api, {storyId, isInGuide}) {
  const response = yield call(api.bulkSaveStoryToGuide, storyId, isInGuide)
  if (response.ok) {
    const {guides} = response.data.entities
    yield [
      put(GuideActions.receiveGuides(guides)),
    ]
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed to add story to guides")
    ))
  }
}

export function * likeGuide(api, {guideId, userId}) {
  const response = yield call(api.likeGuide, guideId)
  if (response.ok) {
    console.log("response", response)
    // const {guides} = response.data.entities
    // yield [
    //   put(GuideActions.receiveGuides(guides)),
    // ]
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed to like guide")
    ))
  }
}

export function * unlikeGuide(api, {guideId, userId}) {
  const response = yield call(api.unlikeGuide, guideId)
  if (response.ok) {
    console.log("response", response)
    // const {guides} = response.data.entities
    // yield [
    //   put(GuideActions.receiveGuides(guides)),
    // ]
  }
  else {
    yield put(GuideActions.guideFailure(
      new Error("Failed to like guide")
    ))
  }
}
