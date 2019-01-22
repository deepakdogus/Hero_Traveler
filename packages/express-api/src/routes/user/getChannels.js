import {User} from '@hero/ht-core'

export default function getFollowers(req, res) {
  return User.find({
    isChannel: true
  })
}
