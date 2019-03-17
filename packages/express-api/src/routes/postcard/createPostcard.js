import { Postcard } from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function createPostcard(req, res) {
  const { postcard: postcardAttrs} = req.body
  const {user} = req
  postcardAttrs.author = user._id
  return Postcard.create(postcardAttrs, formatUploadObject)
}
