import passport from 'passport'

export default function populatesUser(req, res, next) {
  return passport.authenticate('bearer', {session: false}, (err, user) => {
    if (err || !user) {
      if (err) req.err = err
      return next()
    }
    req.user = user
    return next()
  })(req, res)
}
