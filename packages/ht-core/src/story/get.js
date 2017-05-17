import {Story} from '../models'

export default function getOneStory(storyId) {
  return Story.findOne({
    _id: storyId
  })
  .populate('author author.profile.avatar author.profile.cover')
  .populate('categories')
  .populate('coverImage coverVideo')
}
