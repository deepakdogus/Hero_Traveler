import {Comment} from '@rwoody/ht-core'

export default function createComment(req) {
  const userId = req.user._id
  const storyId = req.params.id
  const {content} = req.body
  return Comment.create({
    story: storyId,
    user: userId,
    content
  })
}