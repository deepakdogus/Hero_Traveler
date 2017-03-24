import _ from 'lodash'

export default async function(users, count) {
  if (!users || !users.length){
      throw new Error("No users supplied to story generator")
  }
  return Promise.resolve(_.map(_.range(count), () => {
    const user1 = _.random(0, users.length - 1)
    const user2 = _.random(0, users.length - 1)
    return {
      follower: users[user1]._id,
      followee: users[user2]._id
    }
  }))
}
