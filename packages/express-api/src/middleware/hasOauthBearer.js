import passport from 'passport'

export default function hasOauthBearer(req, res, next) {
  return passport.authenticate('bearer', {session: false}, (err, user) => {
    console.log('has OauthBearer err', err)
    console.log('has OauthBearer user', user)
    if (err || !user) {
      return next(new Error('Unauthorized'))
    }
    req.user = user
    return next()
  })(req, res)
}
