import {User} from '../../ht-core'
import {algoliaHelper} from '@hero/ht-util'

export default function indexUsers(){
  User.find({})
  .then(algoliaHelper.addUsersToIndex)
}
