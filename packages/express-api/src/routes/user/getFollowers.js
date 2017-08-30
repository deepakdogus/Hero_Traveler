import {User} from '@hero/ht-core'

export default function getFollowers(req, res) {
  return User.getFollowers(req.params.id)
}
