import {Guide} from '@hero/ht-core'

export default function getOne(req, res) {
  const id = req.params.id
  return Guide.getGuideById({_id: id})
}
