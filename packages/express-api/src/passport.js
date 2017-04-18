import passport from 'passport'
import {Strategy as BearerStrategy} from 'passport-http-bearer'
import {BasicStrategy} from 'passport-http'
import {User} from '@rwoody/ht-core'

passport.use(
  new BasicStrategy(
    (username, password, next) => {
      User.validateCredentials(username, password)
        .then(user => next(null, user))
        .catch(err => {
          console.log('Auth error', err)
          next(new Error('Unauthorized'))
        })
    }
  )
)

passport.use(
  new BearerStrategy(
    (accessToken, next) => {
      User.validateAccessToken(accessToken)
        .then(user => next(null, user))
        .catch(err => {
          console.log('Auth error', err)
          next(new Error('Unauthorized'))
        })
    }
  )
)

export default passport
