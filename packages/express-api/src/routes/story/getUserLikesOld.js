import {Models} from '@hero/ht-core'

export default function getUserLikes(req) {
  return Models.GuideLike.getUserLikeGuideIds(req.params.userId)
}
