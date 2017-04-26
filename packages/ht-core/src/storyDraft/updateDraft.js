import {StoryDraft} from '../models'
import getDraft from './getDraft'

export default function updateDraft(draftId, attrs) {
  return StoryDraft.findOneAndUpdate({_id: draftId}, attrs)
    .then(() => {
      return getDraft(draftId)
    })
}
