import joi from 'joi'
import Models from '../models'
import encryptPassword from '../utils/encryptPassword'
import getOrCreateTokens from './getOrCreateTokens'

export default function createUser(userData) {
  let userAttrs = Object.assign({}, userData)

  // @TODO validate user

  return encryptPassword(userAttrs.password)
    .then(hashedPassword => {
      userAttrs.password = hashedPassword
      return Models.User.create(userAttrs)
    })
}
