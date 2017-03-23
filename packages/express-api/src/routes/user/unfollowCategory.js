import {User} from '@rwoody/ht-core'

export default function unfollowCategory(req, res) {
  return User.unfollowCategory(req.user._id, req.params.categoryId)
}
