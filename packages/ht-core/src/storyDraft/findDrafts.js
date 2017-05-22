import {Story} from '../models'

export default function findDrafts(userId) {
  return Story.find({author: userId, draft: true})
    .sort({createdAt: -1})
    .populate('categories')
    .populate('coverImage coverVideo')
}
