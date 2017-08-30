import {User} from '@hero/ht-core'

export default function followCategory(req, res) {
  const {categories: categoryIds} = req.body
  return User.followCategory(req.user._id, categoryIds)
}
