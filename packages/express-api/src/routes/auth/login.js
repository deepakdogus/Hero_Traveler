import Promise from 'bluebird'
import passport from 'passport'
import {User} from 'ht-core'

// @TODO standard-error
export default function checkLogin(req, res, next) {
  passport.authenticate(['basic'], {session: false}, (err, user) => {
    if (err || !user) {
      return next(new Error('Unauthorized'))
    }

    User.getOrCreateTokens(user._id)
  .then(token => res.json(token))
      .catch(next)
  })(req, res)
}
