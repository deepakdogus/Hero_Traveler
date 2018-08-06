import {Guide} from '../models'

export default function getGuideById(guideId) {
  return Guide.get({
    _id: guideId
  })
}
