import {Story} from '../models'

export default function findStories(query) {
  return Story.find({
      ...query,
      draft: false
    })
    .sort({createdAt: -1})
    .populate('author author.profile.avatar author.profile.cover')
    .populate('categories')
    .populate('coverImage')
    .populate('coverVideo')
}
