import {User} from '../models'

export default function findUsers(query) {
  return User.find({})
    .sort({createdAt: -1})
}
