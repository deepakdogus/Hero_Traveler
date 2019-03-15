import { call, put } from 'redux-saga/effects'
import GuideActions from '../Redux/Entities/Guides'
import UserActions from '../Redux/Entities/Users'
import CategoryActions from '../Redux/Entities/Categories'
import { createCover } from './StorySagas'
import _ from 'lodash'

export function * createGuide(api, {guide, userId}) {
  yield createCover(api, guide, true)
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
  yield createCover(api, guide, true)
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
    yield [
      put(GuideActions.deleteGuideSuccess(guideId, userId)),
      put(UserActions.removeActivities(guideId, 'guide')),
    ]
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
  // eagerly incrementing guideLike count and adding guide to users like list
  const [response] = yield [
    call(api.likeGuide, guideId),
    put(UserActions.userGuideLike(userId, guideId)),
    put(GuideActions.changeCountOfType(guideId, 'likes', true)),
  ]

  // every update is done greedily so we do not need to do anything upon success
  if (!response.ok) {
    yield put(GuideActions.unlikeGuide(guideId, userId))
    if (_.get(response, 'data.message') !== 'Already liked') {
      yield [
        put(GuideActions.guideFailure(
          new Error("Failed to like guide")
        )),
        put(UserActions.userGuideUnlike(userId, guideId)),
      ]
    }
  }
}

export function * unlikeGuide(api, {guideId, userId}) {
  const [response] = yield [
    call(api.unlikeGuide, guideId),
    put(UserActions.userGuideUnlike(userId, guideId)),
    put(GuideActions.changeCountOfType(guideId, 'likes', false)),
  ]

  // every update is done greedily so we do not need to do anything upon success
  if (!response.ok) {
    yield [
      put(GuideActions.guideFailure(
        new Error("Failed to unlike guide")
      )),
      put(UserActions.userGuideLike(userId, guideId)),
      put(GuideActions.likeGuide(guideId, userId)),
    ]
  }
}

export function * adminGetGuides (api, action) {
  const { params } = action
  const response = yield call(api.adminGetGuides, params)
  if (response.ok && response.data && response.data.data) {
    const { data, count } = response.data
    yield put(GuideActions.adminGetGuidesSuccess({ data, count }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(GuideActions.adminGetGuidesFailure(error))
  }
}

export function * adminGetGuide (api, action) {
  const { id } = action
  const response = yield call(api.adminGetGuide, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(GuideActions.adminGetGuideSuccess({ record }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(GuideActions.adminGetGuideFailure(error))
  }
}

export function * adminPutGuide (api, action) {
  const { values, id, message } = action.payload
  const response = yield call(api.adminPutGuide, { values, id })
  if (response.ok && response.data) {
    const record = response.data
    yield put(GuideActions.adminGetGuideSuccess({ record }))
    message.success('Guide was updated')
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
    yield put(GuideActions.adminPutGuideFailure())
  }
}

export function * adminDeleteGuide (api, action) {
  const { id, history, message } = action.payload
  const response = yield call(api.adminDeleteGuide, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(GuideActions.adminDeleteGuideSuccess(id))
    message.success('Guide was deleted')
    history.goBack()
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
    yield put(GuideActions.adminDeleteGuideFailure())
  }
}

export function * adminRestoreGuides (api, action) {
  const { ids, resolve, reject } = action.payload
  const response = yield call(api.adminRestoreGuides, ids)
  if (response.ok && response.data) {
    const record = response.data
    return resolve(record)
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    return reject(error)
  }
}
