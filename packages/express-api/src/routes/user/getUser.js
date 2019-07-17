import { Models, User } from '@hero/ht-core'
import { ObjectID } from 'mongodb'
import Promise from 'bluebird'

export default function getUser(req, res) {
  const userId = req.params.id

  return ObjectID.isValid(userId)
    ? User.get({_id: userId})
    : Models.User.findOne({username: userId}).then(user => Promise.resolve(user))
}
