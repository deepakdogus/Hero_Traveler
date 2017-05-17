import {Story} from '../models'

export default function findDrafts(userId) {
  return Story.find({author: userId, draft: true})
    .populate('categories')
    .populate('coverImage coverVideo')
}
