import _ from 'lodash'
import {algoliaHelper} from '@hero/ht-util'

import {Category} from '../models'

export default function createCategory(docs) {
  if (!_.isArray(docs)) {
    docs = [docs]
  }

  return Category.insertMany(docs)
  .then(categories => {
    return algoliaHelper.addCategoriesToIndex(categories)
    .then(() => categories)
  })
}
