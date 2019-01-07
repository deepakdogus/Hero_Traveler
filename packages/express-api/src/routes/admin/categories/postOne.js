import {Category} from '@hero/ht-core'

export default function createCategory(req, res) {
  const values = req.body
  return Category.create(values)
}
