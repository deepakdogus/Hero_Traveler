import {User} from '@rwoody/ht-core'

export default function followUser(req, res) {
  return User.followUser(req.user._id, req.params.userId)
}
