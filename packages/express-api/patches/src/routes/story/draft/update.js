import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject'

function isVideoBlock(block) {
  return block.type === 'atomic' && block.data && block.data.type === 'video'
}

export default function updateDraft(req, res) {
  const draftId = req.params.id
  const {story: attrs} = req.body

  return StoryDraft.update(draftId, attrs, formatUploadObject)
}
