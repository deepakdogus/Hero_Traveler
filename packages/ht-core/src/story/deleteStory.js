import {Story} from '../models'
import {StoryBookmark} from '../models'
import {algoliaHelper} from '@hero/ht-util'

export default function deleteStory (storyId) {
  // intentionally doing algolia delete first to prevent client side search crash
  return algoliaHelper.deleteStoryFromIndex(storyId)
  .then(() => 
    Story.delete({_id: storyId}).
    then(() => {
      return StoryBookmark.remove({story: storyId})
    })
  )
}
