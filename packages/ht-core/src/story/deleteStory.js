import {
  Story,
  StoryBookmark,
  Guide,
  ActivityStoryLike,
  ActivityStoryComment,
  Comment,
} from '../models'
import {algoliaHelper} from '@hero/ht-util'

export default function deleteStory (storyId) {
  // intentionally doing algolia delete first to prevent client side search crash
  return algoliaHelper.deleteStoryFromIndex(storyId)
  .then(() => StoryBookmark.remove({story: storyId}))
  .then(() => ActivityStoryLike.remove({story: storyId}))
  .then(() => ActivityStoryComment.remove({story: storyId}))
  .then(() => Comment.remove({story: storyId}))
  .then(() => Guide.find({stories: storyId}))
  .then(guides => {
    return Promise.all(guides.map(guide => {
      const filteredStories = guide.stories.filter(guideStoryId => {
        return String(guideStoryId) !== storyId
      })
      return guide.update({stories: filteredStories})
    }))
  })
  .then(() => Story.delete({_id: storyId}))
}
