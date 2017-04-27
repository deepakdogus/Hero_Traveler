import {Category, Follower} from '../models'

// called when userId follows categoryId
export default function unfollowCategories(userId, categoryIds) {
  return Follower.remove({
    follower: userId,
    followee: {
      $in: [categoryIds]
    }
  })
  .then(() => {
    return Category.update({
      _id: {
        $in: [categoryIds]
      }
    }, {
      $inc: {'counts.following': -1}
    }, {
      multi: true
    })
  })
}
