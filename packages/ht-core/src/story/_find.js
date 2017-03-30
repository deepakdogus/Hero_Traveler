import {Story} from '../models'

export default function findStories(query) {
  return Story.find(query)
    // .select('-content')
}
