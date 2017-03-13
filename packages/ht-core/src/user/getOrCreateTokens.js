import moment from 'moment'
import Models from '../models'
import formatTokenResponse from '../utils/formatTokenResponse'

export default function getOrCreateTokens(userId) {
  return Models.AuthToken.findOrAdd({
      user: userId,
      type: 'access'
    })
    .then(accessToken => {
      return Models.AuthToken.findOrAdd({
        user: userId,
        type: 'refresh'
      })
      .then(refreshToken => {
        return formatTokenResponse(accessToken, refreshToken, userId)
      })
    })
}
