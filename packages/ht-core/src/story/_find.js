import {Story} from '../models'

export default function findStories(query) {
  return Story.find({
      ...query,
      draft: false
    })
    .populate('author author.profile.avatar author.profile.cover')
    .populate('categories')
    .populate('coverImage')
    .populate('coverVideo')
}
