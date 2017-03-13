import moment from 'moment'

const expiresIn = expiresAt =>
  Math.round(moment.duration(
    moment(expiresAt).diff(moment())
  ).asSeconds());

export default function formatTokenResponse(accessToken, refreshToken, userId) {
  return {
    tokens: [{
      type: 'access',
      value: accessToken.value,
      expiresIn: expiresIn(accessToken.expiresAt),
    }, {
      type: 'refresh',
      value: refreshToken.value,
    }],
    user: {
      _id: userId
    },
  }
}
