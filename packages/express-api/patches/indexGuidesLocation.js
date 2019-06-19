import { Models } from '@hero/ht-core'
import { algoliaHelper } from '@hero/ht-util'

export default function indexGuidesLocation() {
  return Models.Guide.find({})
    .populate('coverImage coverVideo author')
    .then(algoliaHelper.updateMultipleGuides)
}
