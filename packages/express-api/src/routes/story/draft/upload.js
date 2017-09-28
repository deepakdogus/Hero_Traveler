import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject'

export default function uploadDraftImage(req, res, next) {
  const draftId = req.params.id
  const file = JSON.parse(req.body.file)

  return Models.Image.create(
    formatUploadObject(
      file,
      {purpose: 'coverImage'}
    )
  )
  .then(image => {
    return StoryDraft.update(draftId, {
      coverImage: image._id
    })
  })
}
