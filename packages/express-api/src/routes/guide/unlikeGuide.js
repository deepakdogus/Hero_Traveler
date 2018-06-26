import {Guide} from '@hero/ht-core'

export default function unlikeGuide(req, res) {
  return Guide.unlikeGuide(req.params.guideId)
}
