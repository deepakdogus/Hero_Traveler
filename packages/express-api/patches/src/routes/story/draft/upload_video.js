import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject';

export default function uploadDraftMedia(req, res, next) {
  const draftId = req.params.id
  let file = req.body.file
  if (typeof file === 'string') file = JSON.parse(req.body.file)
  return Models.Video.create(
    formatUploadObject(
      file,
      {purpose: 'coverVideo'}
    )
  )
  .then(video => {
    return StoryDraft.update(draftId, {
      coverVideo: video._id,
      coverImage: null
    })
  })
}
