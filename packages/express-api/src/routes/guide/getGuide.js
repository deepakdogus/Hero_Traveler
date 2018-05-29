import {Guide} from '@hero/ht-core'

export default function getGuide(req, res) {
  return Guide.getGuideById(req.params.guideId)
}
