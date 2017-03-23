import {User, Follower} from '../models'

// called when userId follows followeeUserId
export default function followUser(userId, followeeUserId) {
  return Follower.create({
    follower: userId,
    followee: followeeUserId,
    type: 'User'
  })
  .then(() => {
    return Promise.all([
      User.update({
        _id: userId
      }, {
        $inc: {'counts.following': 1}
      }),
      User.update({
        _id: followeeUserId
      }, {
        $inc: {'counts.followers': 1}
      })
    ])
  })
}
