import {User} from '@rwoody/ht-core'

export default function suggestFollows(req, res) {
  return User.find({
    _id: {
      $ne: req.user._id
    }
  })
}
