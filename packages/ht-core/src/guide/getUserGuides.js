import {Guide} from '../models'

export default async function getUserGuides(authorId, isAuthor) {
  return Guide
  .list({author: authorId}, isAuthor)
  .exec()
}
