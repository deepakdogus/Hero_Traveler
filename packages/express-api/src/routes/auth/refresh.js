import Promise from 'bluebird'
import passport from 'passport'
import {User} from '@rwoody/ht-core'

export default function refreshAccessToken(req, res, next) {
  const {refreshToken} = req.body
  return User.refreshAccessToken(req.user._id, refreshToken)
}
