import {Story} from '../models'
import {algoliaHelper} from '@hero/ht-util'

export default function deleteStory (storyId) {
  return algoliaHelper.deleteStoryFromIndex(storyId)
  .then(() => Story.delete({_id: storyId}))
}
