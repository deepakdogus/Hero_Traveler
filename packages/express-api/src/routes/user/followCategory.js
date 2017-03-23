import {User} from '@rwoody/ht-core'

export default function followCategory(req, res) {
  return User.followCategory(req.user._id, req.params.categoryId)
}
