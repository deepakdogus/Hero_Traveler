import {StoryDraft} from '../models'

export default function removeDraft(draftId) {
  return StoryDraft.remove({_id: draftId})
}