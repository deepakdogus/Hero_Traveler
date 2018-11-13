import {User} from '@hero/ht-core'
import {algoliaHelper} from '@hero/ht-util'

export default function indexUsers(){
  return User.find({})
  .then(algoliaHelper.addUsersToIndex(users))
}
