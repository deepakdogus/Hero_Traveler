import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject'

export default function uploadDraftImage(req, res, next) {
  const file = req.file
  const folder = process.env.ASSETS_IMAGES_FOLDER
  return Models.Image.create(
    formatUploadObject(
      file,
      folder,
      {purpose: 'storyImage'}
    )
  )
}
