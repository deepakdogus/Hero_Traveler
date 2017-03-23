import {User} from '@rwoody/ht-core'

export default function getCategories(req, res) {
  return User.getCategories(req.user._id)
}
