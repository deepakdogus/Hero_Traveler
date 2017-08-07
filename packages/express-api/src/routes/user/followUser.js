import {User, Models} from '@hero/ht-core'
import {followerNotification} from '../../apn'

export default function followUser(req, res) {
  return User.followUser(req.user._id, req.params.userId)
    .then(({user, followedUser, notify}) => {
      let promise
      if (followedUser.receivesFollowerNotifications() && notify) {
        promise = Models.UserDevice.find({user: followedUser._id})
          .then(devices => devices ?
            followerNotification(devices, user) :
            Promise.resolve()
          )
      } else {
        promise = Promise.resolve()
      }

      return promise
    })
}
