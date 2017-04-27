import {User} from '@rwoody/ht-core'

export default function getUser(req, res) {
  const userId = req.params.id
  return User.get({_id: userId})
}
