import {StoryDraft} from '../models'

export default function getDraft(draftId) {
  return StoryDraft.findOne({
    _id: draftId
  })
}