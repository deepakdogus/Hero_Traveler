import {
  Guide,
  ActivityGuideLike,
  ActivityGuideComment,
  Comment,
} from '../models'

export default function deleteGuide(guideId) {
  return ActivityGuideComment.remove({guide: guideId})
  .then(() => Comment.remove({guide: guideId}))
  .then(() => ActivityGuideLike.remove({guide: guideId}))
  .then(() => Guide.delete({_id: guideId}))
}
