import {Comment} from '@hero/ht-core'

export default function getGuideComments(req) {
  const {guideId} = req.params
  return Comment.find({guide: guideId})
}
