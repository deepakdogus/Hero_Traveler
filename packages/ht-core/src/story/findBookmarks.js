import {StoryBookmark} from '../models'

export default function findBookmarks(userId) {
  return StoryBookmark.getUserBookmarks({
    user: userId
  })
  .then(bookmarks => {
    return bookmarks.map(bookmark => {
      if (!bookmark.story.draft) {
        const bookmarkStory = {...bookmark.story, id: bookmark.story._id}
        // replacing the story id that gets stripped by the .lean call
        // necessary for normalizer to work properly on front-end
        bookmarkStory.author.id = bookmarkStory.author._id
        return bookmarkStory
      }
    })
  })
}
