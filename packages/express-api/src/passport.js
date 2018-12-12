import passport from 'passport'
import {Strategy as BearerStrategy} from 'passport-http-bearer'
import {BasicStrategy} from 'passport-http'
import {User} from '@hero/ht-core'

passport.use(
  new BasicStrategy(
    (userIdentifier, password, next) => {
      console.log('passport basic strategy processing', userIdentifier, password)
      User.validateCredentials(userIdentifier, password)
        .then(user => {
          next(null, user)
          return null
        })
        .catch(err => {
          console.log('Auth error basic strategy', err)
          next(new Error('Unauthorized'))
          return null
        })
    }
  )
)

passport.use(
  new BearerStrategy(
    (accessToken, next) => {
      User.validateAccessToken(accessToken)
        .then(user => {
          next(null, user)
          return null
        })
        .catch(err => {
          console.log('Auth error bearer strategy', err)
          next(new Error('Unauthorized'))
          return null
        })
    }
  )
)

export default passport
