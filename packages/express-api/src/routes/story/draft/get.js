import {StoryDraft} from '@hero/ht-core'

export default function updateDraft(req, res) {
  const draftId = req.params.id
  return StoryDraft.get(draftId)
}
