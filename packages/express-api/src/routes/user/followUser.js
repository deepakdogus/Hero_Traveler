import {User, Models} from '@hero/ht-core'
import {followerNotification} from '../../apn'

export default function followUser(req, res) {
  return User.followUser(req.user._id, req.params.userId)
    .then(({user, followedUser, notify}) => {
      if (followedUser.receivesFollowerNotifications() && notify) {
        // Notifications are not critical for the outcome
        // so they should not block the resolution of the promise.
        followerNotification(followedUser, user);
      }
      return Promise.resolve()
    })
}
