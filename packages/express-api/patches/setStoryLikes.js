import {Models} from '@hero/ht-core'

export default function indexUsers() {
  console.log("starting patch")
  return Models.Story.find({})
  .then(stories => {
    return Promise.all(stories.map(story => {
      return Models.StoryLike.count({
        story: story.id
      })
      .then(likeCount => {
        if (likeCount !== story.counts.likes) {
          console.log("changing likes for", story.id, "from", story.counts.likes, "to", likeCount)
        }
        story.counts.likes = likeCount

        return story.save()
      })
    }))
  })
  .then(() => console.log("patch applied"))
}
