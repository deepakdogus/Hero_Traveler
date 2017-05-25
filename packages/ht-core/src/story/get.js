import {Story} from '../models'

export default function getOneStory(storyId) {
  return Story.get({
    _id: storyId
  })
}
