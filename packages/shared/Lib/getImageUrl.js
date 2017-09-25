import _ from 'lodash'
import Env from '../../Config/Env'
import {getVideoUrlBase} from './getVideoUrl'

export function getImageUrlBase() {
  return `https://res.cloudinary.com/${Env.cloudName}/image/upload`
}

export function getContentBlockImage(urlSuffix) {
  return `${getImageUrlBase()}/q_auto:best,f_auto/${urlSuffix}`
}

export default function getImageUrl(image: object, type = 'cover'): ?string {
  if (!_.has(image, 'original')) return undefined
  const {path, folders} = image.original
  let filename = _.last(path.split('/'))
  // hot fix to avoid search crashing. Need to bulk update algolia
  const folderPath = folders ? folders.join('/') : 'files'
  let url
  // for now we are only optimizing cover photos. Will look into possible Avatar optimizations later
  if (type === 'avatar') url = `${getImageUrlBase()}/${folderPath}/${filename}`
  else if (type === 'video') {
    // replacing video format with jpg to get thumbnail
    filename = filename.split('.')
    filename[filename.length-1] = 'jpg'
    filename = filename.join('.')
    url = `${getVideoUrlBase()}/so_0/${folderPath}/${filename}`
  }
  else url = `${getImageUrlBase()}/q_auto:best,f_auto/${folderPath}/${filename}`
  return url
}
