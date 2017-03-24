import {Category, Follower} from '../models'

// called when userId follows categoryId
export default function unfollowCategories(userId, categoryIds) {
  return Follower.update({
    follower: userId,
    followee: {
      $in: [categoryIds]
    }
  }, {
    endAt: Date.now()
  }, {
    multi: true
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
