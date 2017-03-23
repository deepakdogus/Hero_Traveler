import {User} from '../models'

export default function findUsers(query) {
  return User.find(query)
    .sort({createdAt: -1})
}
