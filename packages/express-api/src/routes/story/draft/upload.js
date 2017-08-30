import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject'

export default function uploadDraftMedia(req, res, next) {
  const draftId = req.params.id
  const file = req.file
  const folder = process.env.ASSETS_IMAGES_FOLDER

  return Models.Image.create(
    formatUploadObject(
      file,
      folder,
      {purpose: 'coverImage'}
    )
  )
  .then(image => {
    return StoryDraft.update(draftId, {
      coverImage: image._id
    })
  })
}
