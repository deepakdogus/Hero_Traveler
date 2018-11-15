import { Models } from '@hero/ht-core'
import { algoliaHelper } from '@hero/ht-util'

export default function indexStoriesLocation() {
  return Models.Story.find({})
  .populate("coverImage coverVideo")
  .then(algoliaHelper.updateMultipleStories)
}
