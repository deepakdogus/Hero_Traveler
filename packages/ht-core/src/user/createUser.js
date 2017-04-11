import joi from 'joi'
import {User} from '../models'
import encryptPassword from '../utils/encryptPassword'
import {welcomeEmail} from '../utils/emailService'
import getOrCreateTokens from './getOrCreateTokens'

export default function createUser(userData) {
	let userAttrs = Object.assign({}, userData)

  // @TODO validate user

  return encryptPassword(userAttrs.password)
  .then(hashedPassword => {
    userAttrs.password = hashedPassword
    return User.create(userAttrs)
  })
  .then(newUser => {
    //send welcome email
    welcomeEmail(newUser)
    return newUser;
  })
}
