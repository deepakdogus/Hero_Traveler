import {Story} from '../models'

export default function getDraft(draftId) {
  return Story.get({
    _id: draftId
  })
}
