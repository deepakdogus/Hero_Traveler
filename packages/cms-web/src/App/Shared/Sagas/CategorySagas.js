import { call, put } from 'redux-saga/effects'
import CategoryActions from '../Redux/Entities/Categories'

export function * getCategories (api, action) {
  const response = yield call(api.getCategories)
  if (response.ok) {
    const { entities } = response.data
    yield put(CategoryActions.loadCategoriesSuccess(entities.categories))
  }
 else {
    yield put(CategoryActions.loadCategoriesFailure())
  }
}
