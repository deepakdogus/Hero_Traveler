import {User, Follower} from '../models'

// called when userId unfollows followeeUserId
export default function unfollowUser(userId, followeeUserId) {
  return Follower.findOne({follower: userId, followee: followeeUserId})
    .then((following) => {
      if (!following) throw new Error('You already unfollow the user')
      return Follower.unfollowUser(userId, followeeUserId)
        .then(() => {
          return Promise.all([
            User.update({
              _id: userId,
              'counts.following': {$gte: 1}
            }, {
              $inc: {'counts.following': -1}
            }),
            User.update({
              _id: followeeUserId,
              'counts.followers': {$gte: 1}
            }, {
              $inc: {'counts.followers': -1}
            })
          ])
        })
    })
}
