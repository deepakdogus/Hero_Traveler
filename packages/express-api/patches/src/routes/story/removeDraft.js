import {Story} from '@hero/ht-core'

export default function createDraft(req, res) {
  const draftId = req.params.id
  return Story.removeDraft(draftId)
}
