import {Category} from '@rwoody/ht-core'

export default function findCategories(req, res) {
  return Category.find({
    '$or': [
      {isDefault: true},
      {isPromoted: true}
    ]
  })
}
