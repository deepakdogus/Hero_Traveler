import {Story} from '../models'

export default function getDraft(draftId) {
  return Story.findOne({
    _id: draftId,
    draft: true
  })
  .populate('categories')
  .populate('coverImage coverVideo')
}
