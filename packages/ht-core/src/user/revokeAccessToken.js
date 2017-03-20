import Promise from 'bluebird'
import {AuthToken} from '../models'

export default function revokeAccessToken(userId, tokens) {
  return Promise.map(tokens, token => {
    return AuthToken.remove({
      value: token.value,
      type: token.type,
      user: userId
    })
  })
}
