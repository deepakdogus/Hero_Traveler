import {User} from '@rwoody/ht-core'

export default function getFollowees(req, res) {
  return User.getFollowees(req.user._id)
}
