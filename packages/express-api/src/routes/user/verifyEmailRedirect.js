import { User } from '@hero/ht-core'

export default function verifyEmailRedirect(req, res) {
  const token = req.params.token
  return User.get({
    emailConfirmationToken: token,
  })
  .then(user => {
    user.isEmailVerified = true
    return user.save()
  })
  .then(user => res.redirect(`${process.env.CORS_ORIGIN}/${user.username}?t=${token}`))
}
