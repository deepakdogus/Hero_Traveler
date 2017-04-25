import {User} from '@rwoody/ht-core'

export default function getFollowers(req, res) {
  return User.getFollowers(req.params.id)
}
