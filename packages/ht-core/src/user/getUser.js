import {User} from '../models'

export default function getUser(query) {
  return User.findOne(query)
}
