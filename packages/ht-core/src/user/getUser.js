import {User} from '../models'

export default function getUser(query, options = false) {
  console.log(options, 'options')
  return User.findOne(query)
             .populate('profile.avatar')
             .populate('profile.cover')
}
