import {Story} from '../models'

export default function deleteStory (draftId) {
  return Story.delete({_id: draftId})
}
