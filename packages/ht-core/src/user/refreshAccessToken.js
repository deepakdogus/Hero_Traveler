import Models from '../models'
import formatTokenResponse from '../utils/formatTokenResponse'
import getUser from './getUser'

export default function refreshAccessToken(userId, refreshTokenValue) {
  return Models.AuthToken.findOne({
    user: userId,
    value: refreshTokenValue,
    type: 'refresh'
  })
  .then(refreshToken => {
    return Models.AuthToken.remove({
      user: userId,
      type: 'access'
    })
    .then(() => {
      return Models.AuthToken.findOrAdd({
        user: userId,
        type: 'access'
      })
      .then(accessToken => {
        return getUser(userId).then(user => {
          return formatTokenResponse(accessToken, refreshToken, user)
        })
      })
    })
  })
}
