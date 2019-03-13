import { Postcard } from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function createPostcard(req, res) {
  const { postcard: postcardAttrs} = req.body
  return Postcard.create(postcardAttrs, formatUploadObject)
}
