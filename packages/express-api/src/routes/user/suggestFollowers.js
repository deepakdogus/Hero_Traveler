import {User} from '@rwoody/ht-core'

export default function suggestFollowers(req, res) {
  return User.suggestedFollowers(req.user._id)
}
