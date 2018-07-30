import {Guide} from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function createGuide(req, res) {
  const {isInGuide} = req.body
  return Guide.bulkSaveStoryToGuide(req.params.storyId, isInGuide)
}
