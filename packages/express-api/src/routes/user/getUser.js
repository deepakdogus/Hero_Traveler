import {User} from '@hero/ht-core'
import { userInfo } from 'os';

export default function getUser(req, res) {
  const userProfileId = req.user && req.user.id
  const userParamsId = req.params.id
  return User.get({_id: userParamsId},  userProfileId === userParamsId)
}
