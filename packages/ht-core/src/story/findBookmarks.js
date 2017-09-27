import {StoryBookmark} from '../models'

export default function findBookmarks(userId) {
  return StoryBookmark.getUserBookmarks({
    user: userId
  })
    .then(bookmarks => {
      return bookmarks.map(bookmark => {
        if (!bookmark.story.draft) return {...bookmark.story, id: bookmark.story._id}
      })
    })
}
