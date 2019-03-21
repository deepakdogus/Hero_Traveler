import {Story} from '@hero/ht-core'
import {likeNotification} from '../../apn'

export default function likeStory(req, res) {
  const likingUser = req.user
  const userId = likingUser._id
  const storyId = req.params.id
  return Story.likeStory(storyId, userId)
  .then(({story, notify}) => {
    if (notify && story.author.receivesLikeNotifications()) {
      likeNotification(story.author, likingUser, story)
    }
    return { notify }
  })
}
