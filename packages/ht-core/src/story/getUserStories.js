import {Story} from '../models'

export default function getUserStories(userId) {
  return Story.getUserStories(userId)
}
