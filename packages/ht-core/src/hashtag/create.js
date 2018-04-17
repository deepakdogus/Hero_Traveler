import _ from 'lodash'

import {Hashtag} from '../models'
import {algoliaHelper} from '@hero/ht-util'

export default function createHashtag(docs) {

  if (!_.isArray(docs)) docs = [docs]

  return Hashtag.insertMany(docs)
  .then(hashtags => {
    algoliaHelper.addHashtagsToIndex(hashtags)
    return hashtags
  })
}
