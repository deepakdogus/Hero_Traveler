import {
  Guide
} from '../models'
import { algoliaHelper } from '@hero/ht-util'

export default async function restoreGuide(guideId) {
  try {
    await Guide.restore({ _id: guideId })
    const populatedGuide = await Guide.get({_id: guideId})
    if (!populatedGuide.isPrivate) algoliaHelper.addGuideToIndex(populatedGuide)
    return
  } catch (err) {
    if (err) return new Error('Unable to restore guide')
  }
}
