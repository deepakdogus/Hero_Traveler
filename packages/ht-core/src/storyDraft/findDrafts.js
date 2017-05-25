import {Story} from '../models'

export default function findDrafts(userId) {
  return Story.list({author: userId, draft: true})
}
