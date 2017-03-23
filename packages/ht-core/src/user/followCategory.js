import {Category, Follower} from '../models'
import _ from 'lodash'

// called when userId follows categoryId
export default function followCategories(userId, categoryIds) {
  const records = _.map(categoryIds, catId => {
    return {
      follower: userId,
      followee: catId,
      type: 'Category'
    }
  })
  return Follower.insertMany(records)
  .then(() => {
    return Category.update({
      _id: {
        $in: [categoryIds]
      }
    }, {
      $inc: {'counts.following': 1}
    }, {
      multi: true
    })
  })
}
