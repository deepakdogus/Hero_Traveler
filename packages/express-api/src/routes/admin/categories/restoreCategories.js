import {Category} from '@hero/ht-core'

const restoreCategory = async(id) => {
  const categoryPromise = Category.get({ _id: id })
  return Category.restoreCategory(categoryIdToUpdate)
}

export default function restoreCategories(req, res) {
  const ids = req.body.ids
  const restoreTasks = ids.map(i => restoreCategory(i))
  return Promise.all(restoreTasks)
}
