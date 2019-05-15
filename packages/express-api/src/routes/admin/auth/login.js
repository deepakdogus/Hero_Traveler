import Promise from 'bluebird'
import passport from 'passport'
import {User} from '@hero/ht-core'

// @TODO standard-error
export default function checkLogin(req, res, next) {
  const {user} = req
  if (user.role !== 'admin') {
    res.statusCode = 403;

    return res.json({
      message: 'Only admins are allowed to login'
    });
  }
  return User.getOrCreateTokens(user._id).catch(e => console.log(e)) 
}
