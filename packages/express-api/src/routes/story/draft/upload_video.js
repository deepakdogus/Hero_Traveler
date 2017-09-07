import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject';

export default function uploadDraftMedia(req, res, next) {
  const draftId = req.params.id
  const file = req.file
  const folder = process.env.ASSETS_VIDEOS_FOLDER
  return Models.Video.create(
    formatUploadObject(
      file,
      folder,
      {purpose: 'coverVideo'}
    )
  )
  .then(video => {
    return StoryDraft.update(draftId, {
      coverVideo: video._id
    })
  })
}
