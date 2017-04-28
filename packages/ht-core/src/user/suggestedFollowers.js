import {User} from '../models'

export default function suggestedFollowers(userId) {
  return User.find({
    _id: {
      $ne: userId
    }
  })
  .sort({'counts.followers': -1})
  .limit(10)
}
