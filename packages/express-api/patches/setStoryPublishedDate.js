import { Models } from '@hero/ht-core'

// patch used to properly set the paths of the default categories
export default function setStoryPublishedDate() {
  return Models.Story.find({
   "publishedDate": {
      "$exists": false
    }
  })
  .then(stories => {
    return Promise.all(stories.map(story => {
      story.publishedDate = story.createdAt
      return story.save()
    }))
  })
}
