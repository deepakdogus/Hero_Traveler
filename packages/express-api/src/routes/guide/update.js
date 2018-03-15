import {Guide} from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function updateGuide(req, res) {
  return Guide.updateGuide(req.body.guide, formatUploadObject)
}
