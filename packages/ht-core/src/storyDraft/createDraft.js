import {Story} from '../models'

export default function createDraft(attrs) {
  return Story.create({...attrs, draft: true})
}
