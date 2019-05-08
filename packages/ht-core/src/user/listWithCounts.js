import {User, Story} from '../models'

export default function listWithCounts(params) {
  return User.getMany(params)
    .then((data) => {
      const countTasks = data.data.map(user => Story.getCountUserStories(user.id).then((count) => ({
        ...user.toObject(),
        numberOfStories: count
      })));
      return Promise.all(countTasks).then((results) => {
        return {
          data: results,
          count: data.count
        }
      })
    })
}
