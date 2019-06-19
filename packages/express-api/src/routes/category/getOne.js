import {Category} from '@hero/ht-core'

export default function getOne(req, res) {
  const id = req.params.id
  return Category.get({_id: id})
}
