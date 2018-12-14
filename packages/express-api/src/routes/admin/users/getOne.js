import {User, Story} from '@hero/ht-core'

export default function getOne(req, res) {
  const userId = req.params.id
  return User.get({_id: userId})
}
