import {
  Guide,
  ActivityGuideLike,
  ActivityGuideComment,
  Comment,
} from '../models'
import { algoliaHelper } from '@hero/ht-util'

export default async function deleteGuide(guideId) {
  try {
    await ActivityGuideComment.remove({ guide: guideId })
    await Comment.remove({ guide: guideId })
    await ActivityGuideLike.remove({ guide: guideId })
    await Guide.delete({ _id: guideId })
    algoliaHelper.deleteGuideFromIndex(guideId)
    return
  } catch (err) {
    if (err) return new Error('Unable to delete guide')
  }
}
