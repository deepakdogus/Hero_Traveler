import {Story} from '../models'

export default function findStories(query) {
  return Story.find(query)
    .populate('author author.profile.avatar author.profile.cover')
    .populate('category')
    .populate('coverImage')
    .populate('coverVideo')
}
