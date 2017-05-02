import Promise from 'bluebird'
import passport from 'passport'
import {User} from '@rwoody/ht-core'

// @TODO standard-error
export default function checkLogin(req, res, next) {
  passport.authenticate(['basic'], {session: false}, (err, user) => {
    if (err || !user) {
      return next(new Error('Unauthorized'))
    }

    const {deviceId} = req.body
    console.log('deviceId', deviceId)

    User.getOrCreateTokens(user._id)
      .then(token => res.json(token))
      .catch(next)
  })(req, res)
}
