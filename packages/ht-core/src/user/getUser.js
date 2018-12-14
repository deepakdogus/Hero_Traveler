import {User} from '../models'

export default function getUser(query, options) {
  console.log('query', query)
  return User.findOne(query)
             .populate('profile.avatar')
             .populate('profile.cover')
}
