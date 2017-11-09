import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject';

export default function uploadDraftVideo(req, res, next) {
  let file = req.body.file
  if (typeof file === 'string') file = JSON.parse(req.body.file)
  return Models.Video.create(
    formatUploadObject(
      file,
      {purpose: 'storyVideo'}
    )
  )
}
