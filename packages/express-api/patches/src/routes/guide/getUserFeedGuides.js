import {Guide} from '@hero/ht-core'

export default function getUserFeedGuides(req, res) {
  return Guide.getUserFeedGuides(req.params.userId)
}
