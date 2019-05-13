import {
  Story
} from '../models'
import { algoliaHelper } from '@hero/ht-util'

export default async function restoreStory(storyId) {
  try {
    await Story.restore({ _id: guideId })
    const populatedStory = await Story.get({_id: guideId})
    if (!populatedStory.isPrivate) algoliaHelper.addStoryToIndex(populatedStory)
    return
  } catch (err) {
    if (err) return new Error('Unable to restore guide')
  }
}
