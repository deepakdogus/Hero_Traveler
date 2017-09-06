import {User} from '@hero/ht-core'

export default function revokeAccessToken(req, res, next) {
  const userId = req.user._id
  const {tokens} = req.body

  if (!tokens || !tokens.length) {
    return next(new Error('Bad request'))
  }

  User.revokeAccessToken(userId, tokens)
    .then(() => res.json({loggedOut: true}))
    .catch(next)
}
