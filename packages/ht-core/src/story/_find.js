import {Story} from '../models'

export default function findStories(query) {
  return Story.list({
      ...query,
      draft: false
    })
}
