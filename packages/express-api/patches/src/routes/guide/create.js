import {Guide} from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function createGuide(req, res) {
  return Guide.createGuide(req.body.guide, formatUploadObject)
}
