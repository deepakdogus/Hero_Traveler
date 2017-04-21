import {User, Follower} from '../models'

// called when userId unfollows followeeUserId
export default function unfollowUser(userId, followeeUserId) {
  return Follower.unfollowUser(userId, followeeUserId)
  .then(() => {
    return Promise.all([
      User.update({
        _id: userId
      }, {
        $inc: {'counts.following': -1}
      }),
      User.update({
        _id: followeeUserId
      }, {
        $inc: {'counts.followers': -1}
      })
    ])
  })
}
