import {User, Story} from '../models'

export default function listWithCounts(params) {
  console.log('params', params);
  return User.getMany(params)
    .then((data) => {
      const countTasks = data.data.map(i => Story.getCountUserStories(i.id).then((count) => ({
        ...i.toObject(),
        numberOfStories: count
      })));
      return Promise.all(countTasks).then((results) => {
        return {
          data: results,
          count: data.count
        };
      });
    });
}
