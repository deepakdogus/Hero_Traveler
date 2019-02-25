import {Story, StoryBookmark} from '../models'

export default function addBookmark(storyId, userId) {
  const record = {
    user: userId,
    story: storyId
  }
  return StoryBookmark.findOne(record)
  .then(storyBookmark => {
    if (storyBookmark) throw new Error('Already liked')
    return StoryBookmark.create(record)
  })
}
