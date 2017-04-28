import {Follower} from '../models'
import findUsers from './find'

export default function getFollowees(userId) {
  return Follower.getUserFollowees(userId)
    .then(userIds => {
      return findUsers({
        _id: {
          $in: userIds
        }
      })
    })
}
