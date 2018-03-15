import {Guide} from '../models'

export default async function getUserGuides(guideId) {
  return Guide
  .list({author: guideId})
  .exec()
}
