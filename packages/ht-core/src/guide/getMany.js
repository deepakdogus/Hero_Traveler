import {Guide} from '../models'

export default function listGuides(query) {
  return Guide.getMany(query)
}
