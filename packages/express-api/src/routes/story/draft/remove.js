import {StoryDraft} from '@rwoody/ht-core'

export default function removeDraft(req, res) {
  const draftId = req.params.id
  return StoryDraft.remove(draftId)
}
