import { Guide } from '../models'
import _ from 'lodash'
import { algoliaHelper } from '@hero/ht-util'
import { parseAndInsertStoryCategories, addCover } from '../story/createStory'

const hasNewCover = guide => (
  (guide.coverImage && !guide.coverImage._id)
  || (guide.coverVideo && !guide.coverVideo._id)
)


const updateAlgoliaIndex = (guide, updatedGuide) => {
    // guide changed from private to public
    if (guide.isPrivate && !updatedGuide.isPrivate) {
      return algoliaHelper.addGuideToIndex(updatedGuide)
    }

    // guide changed from public to private
    if (!guide.isPrivate && updatedGuide.isPrivate) {
      return algoliaHelper.deleteGuideFromIndex(updatedGuide.id)
    }

    // guide remained public through update
    if (!guide.isPrivate && !updatedGuide.isPrivate) {
      return algoliaHelper.updateGuideIndex(updatedGuide)
    }

    // guide remained private through update implicitly handled (no indexing)
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
  updateAlgoliaIndex(guide, updatedGuide)

  return updatedGuide
}
