import { Guide } from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default async function updateGuide(req, res) {
  // disallow updates to guides that don't belong to you
  const userId = req.user._id
  const guide = await Guide.getGuideById(req.params.guideId)
  const isNotGuideAuthor = !userId.equals(guide.author.id)
  if (isNotGuideAuthor) return guide

  return Guide.updateGuide(req.body.guide, formatUploadObject)
}
