import passport from 'passport'

export default function hasOauthBearer(req, res, next) {
  if (req.err || !req.user) {
    return next(new Error('Unauthorized'))
  }
  else next()
}
