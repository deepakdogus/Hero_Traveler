import {User} from '@hero/ht-core'

export default function getUser(req, res) {
  console.log(req.user.id, 'this is a user id in the express route')
  const userId = req.params.id
  return User.get({_id: userId})
}
