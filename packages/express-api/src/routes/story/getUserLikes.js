import {Models} from '@hero/ht-core'

export default function getUserLikes(req) {
  return Promise.all([
    Models.GuideLike.getUserLikeGuideIds(req.params.userId),
    Models.StoryLike.getUserLikeStoryIds(req.params.userId),
  ]).then(likes => {
    return {
      guides: likes[0],
      stories: likes[1]
    }
  })
}
