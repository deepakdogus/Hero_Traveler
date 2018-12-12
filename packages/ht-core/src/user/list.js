import {User} from '../models'

export default function listUsers(query) {
  return User.list(query)
}
