import {Guide} from '@hero/ht-core'

export default function likeGuide(req, res) {
  return Guide.likeGuide(req.params.guideId, req.user.id)
}
