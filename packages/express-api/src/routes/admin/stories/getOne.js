import {Story} from '@hero/ht-core'

export default function getOne(req, res) {
  const id = req.params.id
  return Story.get({_id: id})
}
