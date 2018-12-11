import bcrypt from 'bcrypt'
import Promise from 'bluebird'
import {Constants} from '@hero/ht-util'

export default function encryptPassword(password) {
  if (password.length > Constants.PASSWORD_MAX_LENGTH) {
    password = password.substr(0, Constants.PASSWORD_MAX_LENGTH)
  }

  return new Promise((resolve, reject) => {
    return resolve()
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err)
      }

      return resolve(hash)
    })
  })
}
