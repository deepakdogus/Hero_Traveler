import {Category} from '@hero/ht-core'
import _ from 'lodash'

export default async function deleteCategory(req) {
  const categoryIdToUpdate = req.params.id

  return Category.deleteCategory(categoryIdToUpdate)
}
