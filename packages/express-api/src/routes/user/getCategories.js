import {User} from '@hero/ht-core'

export default function getCategories(req, res) {
  return User.getCategories(req.user._id)
}
