import _ from 'lodash'
import faker from 'faker'

let faketags = faker.lorem.words(100).split(" ");

function create(faketag) {
  return {
    "title": faketag,
    "isDefault": true,
  }
}

export default function() {
  return Promise.all(_.map(faketags, create))
}
