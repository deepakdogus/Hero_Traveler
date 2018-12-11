import Promise from 'bluebird'
import passport from 'passport'
import {User} from '@hero/ht-core'

// @TODO standard-error
export default function checkLogin(req, res, next) {
  const {user} = req
  console.log('logging user in', user)
  return User.getOrCreateTokens(user._id).catch(e => console.log(e)) 
}
