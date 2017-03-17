import moment from 'moment'
import Models from '../models'
import formatTokenResponse from '../utils/formatTokenResponse'
import getUser from './getUser'

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
        return getUser({_id: userId})
          .then(user => {
            return formatTokenResponse(accessToken, refreshToken, user)
          })
      })
    })
}
