import {Category} from '@hero/ht-core'
import _ from 'lodash'

export default function createCategory(req, res) {
  const values = req.body
  const { title } = values
  return Category.get({ title }).then((response) => {
    if (_.isNull(response)) {
      return Category.create(values)
    } else {
      throw new Error('category with this title already exists, input different title')
    }
  })
}
