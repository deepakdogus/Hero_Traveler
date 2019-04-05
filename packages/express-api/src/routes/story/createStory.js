import {Story} from '@hero/ht-core'
import formatUploadObject from '../../utils/formatUploadObject'

export default function createStory(req, res) {
  const {story: storyAttrs} = req.body
  console.log('story', JSON.stringify(storyAttrs))
  return Story.create(storyAttrs, formatUploadObject)
}
