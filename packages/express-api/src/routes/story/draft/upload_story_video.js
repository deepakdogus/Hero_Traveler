import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject';

export default function uploadDraftVideo(req, res, next) {
  const file = JSON.parse(req.body.file)
  const folder = process.env.ASSETS_VIDEOS_FOLDER
  return Models.Video.create(
    formatUploadObject(
      file,
      folder,
      {purpose: 'storyVideo'}
    )
  )
}
