import faker from 'faker'
import _ from 'lodash'

function create() {
  return {
    username: faker.internet.userName(),
    password: 'herotraveler',
    email: faker.internet.email(),
    name: faker.name.findName()
  }
}

export default (count) => {
  return _.map(_.range(count), () => {
    return create()
  })
}