import Models from '../models'
import formatTokenResponse from '../utils/formatTokenResponse'

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
        return formatTokenResponse(accessToken, refreshToken, userId)
      })
    })
  })
}
