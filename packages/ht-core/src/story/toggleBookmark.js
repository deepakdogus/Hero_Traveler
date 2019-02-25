import {Story, StoryBookmark} from '../models'

export default function toggleBookmark(storyId, userId) {
  const record = {
    user: userId,
    story: storyId
  }
  return StoryBookmark.findOne(record)
    .then(storyBookmark => {
      if (storyBookmark) {
        return StoryBookmark.findOneAndRemove({
            _id: storyBookmark._id
          })
          .then(() => false)
      } else {
        return StoryBookmark.create(record)
          .then(() => true)
      }
    })
    .then(isBookmarked => {isBookmarked})
}
