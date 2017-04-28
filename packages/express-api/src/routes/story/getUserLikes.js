import {Models} from '@rwoody/ht-core'

export default function getUserLikes(req) {
  return Models.StoryLike.getUserLikeStoryIds(req.params.userId)
}