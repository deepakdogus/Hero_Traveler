import bcrypt from 'bcrypt'
import Promise from 'bluebird'
import {Constants} from '@rwoody/ht-util'

const hash = Promise.promisify(bcrypt.hash)
const genSalt = Promise.promisify(bcrypt.genSalt)

export default function encryptPassword(password) {
  if (password.length > Constants.PASSWORD_MAX_LENGTH) {
    password = password.substr(0, Constants.PASSWORD_MAX_LENGTH)
  }

  return genSalt(10).then(salt => {
    return hash(password, salt)
  })
}
