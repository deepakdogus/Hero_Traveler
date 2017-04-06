import {StoryDraft} from '../models'

export default function findDrafts(userId) {
  return StoryDraft.find({author: userId})
}