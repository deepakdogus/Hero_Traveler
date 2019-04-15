import {Story, User, Models} from '@hero/ht-core'
import {likeNotification} from '../../apn'

export default function toggleLike(req, res) {
  const likingUser = req.user
  const userId = likingUser._id
  const storyId = req.params.id
  return Story.toggleLike(storyId, userId)
    .then(({isLiked, story, notify}) => {
      let promise
      if (isLiked) {
        promise = Models.Story.populate(story, {path: 'author'})
          .then(storyWithUser => {
            const likedUser = storyWithUser.author
            if (likedUser.receivesLikeNotifications() && notify) {
              // Notifications are not critical for the outcome
              // so they should not block the resolution of the promise.
              likeNotification(likedUser, likingUser, story);
            }
            return Promise.resolve()
          })
      } else {
        promise = Promise.resolve()
      }

      return promise.then(() => Promise.resolve({isLiked, story}))
    })
}
