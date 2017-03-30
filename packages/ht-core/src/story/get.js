import {Story} from '../models'

export default function getOneStory(storyId) {
  return Story.findOne({
    _id: storyId
  })
}
