import {User} from '@rwoody/ht-core'

export default function unfollowUser(req, res) {
  return User.unfollowUser(req.user._id, req.params.userId)
}
