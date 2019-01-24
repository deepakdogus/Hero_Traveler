import {Category} from '@hero/ht-core'
import _ from 'lodash'

export default function findCategories(req, res) {
  const { query = {} } = req
  const parsedQuery = query && _.isString(query) ? JSON.parse(query) : query;

  return Category.find({
    ..._.mapValues(parsedQuery, v => {
      if (v === 'true') return true
      return v
    }),
    $or: [
      {isDefault: true},
      {isPromoted: true}
    ]
  })
}
