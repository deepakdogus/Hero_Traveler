import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject'

export default function uploadDraftImage(req, res, next) {
  const draftId = req.params.id
  // req.body.file is not properly parsed from mobile but is for web
  let file = req.body.file
  if (typeof file === 'string') file = JSON.parse(req.body.file)

  return Models.Image.create(
    formatUploadObject(
      file,
      {purpose: 'coverImage'}
    )
  )
  .then(image => {
    return StoryDraft.update(draftId, {
      coverImage: image._id,
      coverVideo: null,
    })
  })
}
