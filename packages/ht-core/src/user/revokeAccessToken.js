import Promise from 'bluebird'
import Models from '../models'

export default function revokeAccessToken(userId, tokens) {
  return Promise.map(tokens, token => {
    return Models.AuthToken.remove({
      value: token.value,
      type: token.type,
      user: userId
    })
  })
}
