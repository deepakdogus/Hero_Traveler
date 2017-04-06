import {StoryDraft} from '../models'

export default function updateDraft(draftId, attrs) {
  return StoryDraft.findOneAndUpdate({_id: draftId}, attrs)
}