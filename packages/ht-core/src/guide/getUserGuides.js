import {Guide} from '../models'

export default async function getUserGuides(authorId, isShowEmptyGuides) {
  return Guide
  .list({author: authorId}, isShowEmptyGuides)
  .exec()
}
