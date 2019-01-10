import {Story} from '../models'

export default function findDeletedStories(userId) {
  return Story.findDeleted({
    deleted: true,
    author: userId,
  })
  .select('deleted author _id')
}
