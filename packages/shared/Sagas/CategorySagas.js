import { call, put } from 'redux-saga/effects'
import CategoryActions from '../Redux/Entities/Categories'

export function * getCategories (api, action) {
  const response = yield call(api.getCategories)
  if (response.ok) {
    const { entities } = response.data;
    yield put(CategoryActions.loadCategoriesSuccess(entities.categories))
  } else {
    yield put(CategoryActions.loadCategoriesFailure())
  }
}


export function * adminGetCategories (api, action) {
  const { params } = action
  const response = yield call(api.adminGetCategories, params)
  if (response.ok && response.data && response.data.data) {
    const { data, count } = response.data
    yield put(CategoryActions.adminGetCategoriesSuccess({ data, count }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(CategoryActions.adminGetCategoriesFailure(error))
  }
}

export function * adminGetCategory (api, action) {
  const { id } = action
  const response = yield call(api.adminGetCategory, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(CategoryActions.adminGetCategorySuccess({ record }))
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    yield put(CategoryActions.adminGetCategoryFailure(error))
  }
}

export function * adminPutCategory (api, action) {
  const { values, id, message } = action.payload
  const response = yield call(api.adminPutCategory, { values, id })
  if (response.ok && response.data) {
    const record = response.data
    yield put(CategoryActions.adminGetCategorySuccess({ record }))
    message.success('Category was updated')
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
    yield put(CategoryActions.adminPutCategoryFailure())
  }
}

export function * adminDeleteCategory (api, action) {
  const { id, history, message } = action.payload
  const response = yield call(api.adminDeleteCategory, id)
  if (response.ok && response.data) {
    const record = response.data
    yield put(CategoryActions.adminDeleteCategorySuccess(id))
    message.success('Category was deleted')
    history.goBack()
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
    yield put(CategoryActions.adminDeleteCategoryFailure())
  }
}

export function * adminRestoreCategories (api, action) {
  const { ids, message, getParams } = action.payload
  const response = yield call(api.adminRestoreCategories, ids)
  if (response.ok && response.data) {
    const record = response.data
    message.success('Categories were restored')
    const categoryResponse = yield call(api.adminGetCategories, getParams)
    if (categoryResponse.ok && categoryResponse.data && categoryResponse.data.data) {
      const { data, count } = categoryResponse.data
      yield put(CategoryActions.adminGetCategoriesSuccess({ data, count }))
    } else {
      const error = categoryResponse.data ? categoryResponse.data.message : 'Error fetching data'
      yield put(CategoryActions.adminGetCategoriesFailure(error))
    }
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
  }
}

export function * adminPostCategory (api, action) {
  const { values, history, message } = action.payload
  const response = yield call(api.adminPostCategory, { values })
  if (response.data && response.data.length) {
    const record = response.data[0]
    yield put(CategoryActions.adminGetCategorySuccess({ record }))
    message.success('Category was created')
    history.goBack()
  } else {
    const error = response.data ? response.data.message : 'Error fetching data'
    message.error(error)
    yield put(CategoryActions.adminPutCategoryFailure())
  }
}
