import faker from 'faker'
import _ from 'lodash'

function create() {
  return {
    username: faker.internet.userName(),
    password: 'herotraveler',
    email: faker.internet.email(),
    profile: {
      fullName: faker.name.findName(),
      avatar: faker.internet.avatar()
    }
  }
}

export default (count) => {
  return _.map(_.range(count), () => {
    return create()
  })
}
