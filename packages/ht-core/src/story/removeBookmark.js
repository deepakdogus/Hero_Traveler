import {Story, StoryBookmark} from '../models'

export default function removeBookmark(storyId, userId) {
  const record = {
    user: userId,
    story: storyId
  }
  return StoryBookmark.findOne(record)
  .then(storyBookmark => {
    if (!storyBookmark) return
    return StoryBookmark.findOneAndRemove({
      _id: storyBookmark.id
    })
  })
}
