import { Guide } from '../models'
import _ from 'lodash'
import { algoliaHelper } from '@hero/ht-util'
import { parseAndInsertStoryCategories, addCover } from '../story/createStory'

function hasNewCover(guide) {
  return (
    (guide.coverImage && !guide.coverImage._id) ||
    (guide.coverVideo && !guide.coverVideo._id)
  )
}

export default async function updateGuide(attrs, assetFormater) {
  let guide = await Guide.findById(attrs.id)
  attrs = _.omit(attrs, 'author')
  if (hasNewCover(attrs)) await addCover(attrs, assetFormater)

  if (attrs.categories && _.size(attrs.categories)) {
    // @TODO: this should probably happen in middleware
    attrs.categories = await parseAndInsertStoryCategories(attrs.categories)
  }

  await guide.update(attrs)
  const updatedGuide = await Guide.get({ _id: attrs.id })
  algoliaHelper.updateGuideIndex(updatedGuide)

  return updatedGuide
}
