import {User} from '@hero/ht-core'

export default function getFollowees(req, res) {
  return User.getFollowees(req.params.id)
}
