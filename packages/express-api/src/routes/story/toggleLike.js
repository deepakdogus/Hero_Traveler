import {Story, User, Models} from '@rwoody/ht-core'
import {likeNotification} from '../../apn'

export default function toggleLike(req, res) {
  const userId = req.user._id
  const storyId = req.params.id
  return Story.toggleLike(storyId, userId)
    .then(({isLiked, story, notify}) => {
      let promise
      if (isLiked) {
        promise = Models.Story.populate(story, {path: 'author'})
          .then(storyWithUser => {
            const user = storyWithUser.author
            if (user.receivesLikeNotifications()) {
              return Models.UserDevice.find({user: user._id})
                .then(devices =>
                  !!devices && notify ?
                    likeNotification(devices, req.user, storyWithUser) :
                    Promise.resolve()
                )
            } else {
              return Promise.resolve()
            }
          })
      } else {
        promise = Promise.resolve()
      }

      return promise.then(() => Promise.resolve({isLiked, story}))
    })
}
