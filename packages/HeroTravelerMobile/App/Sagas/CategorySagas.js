import { call, put } from 'redux-saga/effects'
import CategoryActions from '../Redux/CategoryRedux'

export function * getCategories (api, action) {
  const response = yield call(api.getCategories)
  if (response.ok) {
    const { data: categories } = response;
    yield put(CategoryActions.loadCategoriesSuccess(categories))
  } else {
    yield put(CategoryActions.loadCategoriesFailure())
  }
}
