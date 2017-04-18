import joi from 'joi'
import {User} from '../models'
import encryptPassword from '../utils/encryptPassword'
import {welcomeEmail} from '../utils/emailService'
import getOrCreateTokens from './getOrCreateTokens'
import uuid from 'uuid'

export default function createUser(userData) {
	let userAttrs = Object.assign({}, userData)

  // @TODO validate user

  return encryptPassword(userAttrs.password)
  .then(hashedPassword => {
    userAttrs.password = hashedPassword
    // @TODO use json web tokens
    userAttrs.emailConfirmationToken = uuid()
    return User.create(userAttrs)
  })
  .then(newUser => {
    welcomeEmail(newUser)
    return newUser;
  })
}
