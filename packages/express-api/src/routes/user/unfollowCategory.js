import {User} from '@rwoody/ht-core'

export default function unfollowCategory(req, res) {
  const {categories: categoryIds} = req.body
  return User.unfollowCategory(req.user._id, categoryIds)
}
