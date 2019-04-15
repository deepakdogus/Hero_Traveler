import Promise from 'bluebird'
import passport from 'passport'
import {User} from '@hero/ht-core'

// @TODO standard-error
export default function checkLogin(req, res, next) {
  const {user} = req
  return User.getOrCreateTokens(user._id)
}
