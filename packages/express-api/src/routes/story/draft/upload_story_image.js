import {StoryDraft, Models} from '@hero/ht-core'
import formatUploadObject from '../../../utils/formatUploadObject'

export default function uploadDraftImage(req, res, next) {
  let file = req.body.file
  if (typeof file === 'string') file = JSON.parse(req.body.file)
  return Models.Image.create(
    formatUploadObject(
      file,
      {purpose: 'storyImage'}
    )
  )
}
