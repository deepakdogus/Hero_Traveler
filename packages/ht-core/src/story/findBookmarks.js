import {StoryBookmark} from '../models'
import findStories from './_find'

export default function findBookmarks(userId) {
  return StoryBookmark.find({
    user: userId
  })
  .lean()
  .distinct('story')
  .then(bookmarkIds => {
    return findStories({
      _id: {
        $in: bookmarkIds
      }
    })
  })
}