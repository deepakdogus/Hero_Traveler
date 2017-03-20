import {Story} from '../models'

export default function findStories() {
  return Story.find({})
}
