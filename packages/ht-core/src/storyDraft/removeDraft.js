import {Story} from '../models'

export default function removeDraft(draftId) {
  return Story.delete({_id: draftId})
}
