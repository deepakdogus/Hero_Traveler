import _ from 'lodash'
import {Hashtag} from '../models'

import algoliasearchModule from 'algoliasearch'

const client = algoliasearchModule(process.env.ALGOLIA_ACCT_KEY, process.env.ALGOLIA_API_KEY)
const hashtagIndex = client.initIndex(process.env.ALGOLIA_HASHTAG_INDEX)


const addHashtagsToIndex = (docs) => new Promise((resolve, reject) => {
  // return early if we are not seeding
  if (process.env.DISABLE_ALGOLIA) {
    return resolve()
  }
  hashtagIndex.addObjects(docs, (err, content) => {
    if (err) reject(err)
    if (content) resolve(content)
  })
})

export default function createHashtag(docs) {

  if (!_.isArray(docs)) {
    docs = [docs]
  }

  return Hashtag.insertMany(docs)
    .then(hashtags => {
      const searchHashtagDocs = _.map(hashtags, h => {
        return {
          _id: h._id,
          title: h.title
        }
      })

      return addHashtagsToIndex(searchHashtagDocs)
      .then(() => hashtags)
    })
}
