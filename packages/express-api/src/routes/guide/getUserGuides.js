import {Guide} from '@hero/ht-core'

export default function getUserGuides(req, res) {
  return Guide.getUserGuides(req.params.userId)
}
