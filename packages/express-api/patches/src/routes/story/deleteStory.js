import {Story} from '@hero/ht-core'

export default function deleteStory (req, res) {
  const draftId = req.params.id
  return Story.deleteStory(draftId)
}
