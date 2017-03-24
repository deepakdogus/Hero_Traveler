import moment from 'moment'
import {AuthToken} from '../models'
import getUser from './getUser'

export default function validateAccessToken(accessToken) {
  return AuthToken.findOne({
    value: accessToken,
    type: 'access'
  })
  .then(userAccessToken => {
    if (!userAccessToken) {
      return Promise.reject(new Error('Access token not found'))
    }

    if (moment(userAccessToken.expiresAt).unix() < moment().unix()) {
      AuthToken.remove({
        value: tokenValue,
        type: 'access'
      })
      return Promise.reject(new Error('Access token has expired'))
    }

    return getUser({_id: userAccessToken.user})
  })
}
