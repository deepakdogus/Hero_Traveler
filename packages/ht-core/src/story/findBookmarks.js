import {StoryBookmark} from '../models'

export default function findBookmarks(userId) {
  return StoryBookmark.find({
    user: userId
  })
  .populate('story')
}