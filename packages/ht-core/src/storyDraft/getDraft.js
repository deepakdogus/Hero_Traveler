import {Story} from '../models'

export default function getDraft(draftId) {
  return Story.findOne({
    _id: draftId
  })
  .populate('categories')
  .populate('coverImage coverVideo')
}
