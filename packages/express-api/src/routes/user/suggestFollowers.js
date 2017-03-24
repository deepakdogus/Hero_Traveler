import {User} from '@rwoody/ht-core'

export default function suggestFollows(req, res) {
  return User.suggestedFollowers(req.user._id)
}
