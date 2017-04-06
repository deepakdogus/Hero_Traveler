import {Story} from '@rwoody/ht-core'

export default function createDraft(req, res) {
  const draftId = req.params.id
  return Story.removeDraft(draftId)
}
