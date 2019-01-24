import _ from 'lodash'
import { call, put, select } from 'redux-saga/effects'
import DiscoverActions from '../Redux/DiscoverRedux'

export function  * getChannels(api) {
  const response = yield call(
    api.getChannels
  )

  if (response.ok) {
    yield put(DiscoverActions.fetchChannelsSuccess(response.data))
  } else {
    yield put(DiscoverActions.fetchChannelsFailure(new Error('Failed to fetch channels')))
  }
}

export function  * getDiscoverCategories(api) {
  const response = yield call(
    api.getDiscoverCategories,
    { featured: true }
  )

  if (response.ok) {
    yield put(DiscoverActions.fetchCategoriesSuccess(response.data))
  } else {
    yield put(DiscoverActions.fetchCategoriesFailure(new Error('Failed to fetch categories')))
  }
}
