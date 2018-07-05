import {User} from '../models'
import {algoliaHelper} from '@hero/ht-util'

export default function deleteUser (userId) {
  return algoliaHelper.deleteUserFromIndex(userId).then(() => 
    User.delete({_id: userId})
  )
}
