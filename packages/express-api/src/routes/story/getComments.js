import {Comment} from '@rwoody/ht-core'

export default function getComments(req) {
  const storyId = req.params.id
  return Comment.find(storyId)
}