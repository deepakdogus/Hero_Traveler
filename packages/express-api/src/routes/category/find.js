import {Category} from '@hero/ht-core'

export default function findCategories(req, res) {
  const { query = {} } = req
  return Category.find({
    ...query,
    $or: [
      {isDefault: true},
      {isPromoted: true}
    ]
  })
}
