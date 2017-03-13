import Promise from 'bluebird'
import Models from '../models'
import formatTokenResponse from '../utils/formatTokenResponse'

export default function revokeAccessToken(userId, tokens) {
  return Promise.map(tokens, token => {
    return Models.AuthToken.remove({
      value: token.value,
      type: token.type,
      user: userId
    })
  })
}
