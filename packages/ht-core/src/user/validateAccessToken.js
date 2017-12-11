import moment from 'moment'
import {AuthToken} from '../models'
import getUser from './getUser'

export default function validateAccessToken(accessToken) {
  console.log('BACKEND access', accessToken)
  return AuthToken.findOne({
    value: accessToken,
    type: 'access'
  })
  .then(accessToken => {
    if (!accessToken) {
      return Promise.reject(new Error('Access token not found'))
    }

    if (moment(accessToken.expiresAt).unix() < moment().unix()) {
      AuthToken.remove({
        value: accessToken.value,
        type: 'access'
      })
      return Promise.reject(new Error('Access token has expired'))
    }

    return getUser({_id: accessToken.user})
  })
}
