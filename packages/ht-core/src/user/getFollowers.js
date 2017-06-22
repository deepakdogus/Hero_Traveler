import {Follower} from '../models'
import findUsers from './find'
export default function getFollowers(userId) {
  return Follower.getUserFollowers(userId)
    .then(userIds => {
      return findUsers({
        _id: {
          $in: userIds
        },
      })
      .populate('profile.avatar')
    })
}
