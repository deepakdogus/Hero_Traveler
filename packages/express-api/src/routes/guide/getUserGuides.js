import {Guide} from '@hero/ht-core'

export default function getUserGuides(req, res) {
  if (!req.user) return Guide.getUserGuides(req.params.userId, false)
  return Guide.getUserGuides(req.params.userId, req.user.id === req.params.userId)
}
