import {User} from 'ht-core'

export default function getMe(req, res) {
  const userId = req.user._id
  return User.get({_id: userId})
}
