import {Story} from '../models'

export default function deleteStory (storyId) {
  return Story.delete({_id: storyId})
}
