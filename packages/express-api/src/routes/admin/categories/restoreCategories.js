import {Category} from '@hero/ht-core'

const restoreCategory = async(id) => {
  const categoryPromise = Category.get({ _id: id })

  return categoryPromise
  .then((category) => {
    category.isDeleted = false
    return category.save()
  });
}

export default function restoreCategories(req, res) {
  const ids = req.body.ids
  const restoreTasks = ids.map(i => restoreCategory(i))
  return Promise.all(restoreTasks)
}
