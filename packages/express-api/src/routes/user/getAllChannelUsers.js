import { User } from '@hero/ht-core'

export default function getAllChannelUsers(req, res) {
  return User.find({ isChannel: true })
}
