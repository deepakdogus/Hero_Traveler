import {User} from '@hero/ht-core'

export default function getUser(req, res) {
  const userId = req.params.id
  return User.get({_id: userId})
}
