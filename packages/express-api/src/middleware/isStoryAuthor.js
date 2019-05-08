import { Models } from '@hero/ht-core'

export default function isStoryAuthor(req, res, next) {
  return Models.Story.isAuthor(req.params.id, req.user._id)
  .then(isAuthor => {
    if (!isAuthor) {
      return next(new Error('Unauthorized'))
    }
    else next()
  })
}
