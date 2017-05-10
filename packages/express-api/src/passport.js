import passport from 'passport'
import {Strategy as BearerStrategy} from 'passport-http-bearer'
import {BasicStrategy} from 'passport-http'
import {User} from '@rwoody/ht-core'

passport.use(
  new BasicStrategy(
    (username, password, next) => {
      User.validateCredentials(username, password)
        .then(user => {
          next(null, user)
          return null
        })
        .catch(err => {
          console.log('Auth error', err)
          next(new Error('Unauthorized'))
          return null
        })
    }
  )
)

passport.use(
  new BearerStrategy(
    (accessToken, next) => {
      console.log('accessToken', accessToken)
      User.validateAccessToken(accessToken)
        .then(user => {
          console.log('user', user)
          next(null, user)
          return null
        })
        .catch(err => {
          console.log('Auth error', err)
          next(new Error('Unauthorized'))
          return null
        })
    }
  )
)

export default passport
