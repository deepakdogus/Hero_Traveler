import _ from 'lodash'
import {Category} from '../models'

import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const categoryIndex = client.initIndex(process.env.ALGOLIA_CATEGORY_INDEX)


const addCategoriesToIndex = (docs) => new Promise((resolve, reject) => {
  // return early if we are not seeding
  if (process.env.DISABLE_ALGOLIA) {
    return resolve()
  }
  categoryIndex.addObjects(docs, (err, content) => {
    if (err) reject(err)
    if (content) resolve(content)
  })
})

export default function createCategory(docs) {

  if (!_.isArray(docs)) {
    docs = [docs]
  }

  return Category.insertMany(docs)
    .then(categories => {
      const searchCategoryDocs = _.map(categories, c => {
        return {
          _id: c._id,
          title: c.title
        }
      })

      return addCategoriesToIndex(searchCategoryDocs)
      .then(() => categories)
    })
}
