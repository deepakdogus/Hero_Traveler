import {Guide} from '@hero/ht-core'

export default function deleteGuide(req, res) {
  const guideId = req.params.guideId
  return Guide.deleteGuide(guideId)
}
