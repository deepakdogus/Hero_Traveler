import {StoryDraft, Category} from '../models'

export default function createDraft(attrs) {
  return StoryDraft.create(attrs)
}
