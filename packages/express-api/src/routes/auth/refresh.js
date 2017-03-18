import Promise from 'bluebird'
import passport from 'passport'
import {User} from '@rwoody/ht-core'

export default function refreshAccessToken(req, res, next) {
  const userId = req.user._id
  const {refreshToken} = req.body
  User.refreshAccessToken(req.user._id, refreshToken)
    .then(data => res.json(data))
    .catch(err => next(new Error('Unauthorized1')))
}
