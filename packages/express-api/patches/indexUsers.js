import {User} from '@hero/ht-core'
import {algoliaHelper} from '@hero/ht-util'

export default function indexUsers(){
  return User.find({})
  .populate('profile.avatar')
  .then(users => algoliaHelper.addUsersToIndex(users))
  .then(users => console.log(users => console.log(users, 'loggin users')))
}
