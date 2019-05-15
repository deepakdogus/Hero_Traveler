import {Story} from '../models'

export default function listStories(query) {
  return Story.getMany(query)
}
