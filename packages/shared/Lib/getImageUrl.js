import _ from 'lodash'
import Env from '../../Config/Env'
// import {getVideoUrlBase} from './getVideoUrl'
import metrics from '../Themes/Metrics'

function getImageUrlBase() {
  return `https://res.cloudinary.com/${Env.cloudName}/image/upload`
}

function buildUrl(uri: string, urlParameters: object, base: string): string {
  const parameters = _.map(_.toPairs(urlParameters || {}), function(pair) {
    return `${pair[0]}_${pair[1]}`
  })

  if (parameters.length > 0) {
    const parameterString = parameters.join(',')
    return `${getImageUrlBase()}/${parameterString}/${uri}`
  }

  return `${getImageUrlBase()}/${uri}`
}

function ensureJpgExtension(uri: string): string {
    uri = uri.split('.')
    uri[uri.length-1] = 'jpg'
    uri = uri.join('.')
    return uri 
}

function getUri(image: object|string): ?string {
  if (!image) {
    return undefined 
  }

  if (typeof(image) == 'string') {
    return ensureJpgExtension(image)
  } else if (typeof(image) == 'object' && _.has(image, 'original')) {
    const {path, folders} = image.original
    if (!path) {
      return undefined
    }

    const filename = ensureJpgExtension(_.last(path.split('/')))
    // hot fix to avoid search crashing. Need to bulk update algolia
    const folderPath = folders ? folders.join('/') : 'files'
    return `${folderPath}/${filename}`
  }

  return undefined 
}

function getBasicOptimizedUrlParameters(size: object) {
  const urlParameters = {
    f: 'auto',
  }

  if (size.width) {
    urlParameters.w = `${size.width}`
  }

  if (size.height) {
    urlParameters.h = `${size.height}`
  }

  if (size.width && size.height) {
    urlParameters.c = 'fill'
  }

  return urlParameters
}

function getContentBlockImage(uri: string, size: object): string {
  return buildUrl(uri, {q: 'auto:best', f: 'auto'})
}

function getBasicImageUrl(uri: string, size: object): string {
  return buildUrl(uri)
}

function getAvatarImageUrl(uri: string, size: object): string {
  return buildUrl(uri)
}

function getLoadingPreviewImageUrl(uri: string, size: object): string {
  const urlParameters = getBasicOptimizedUrlParameters(size)
  urlParameters.q = 'auto:low'
  urlParameters.e = 'blur:5000'
  return buildUrl(uri, urlParameters)
}

function getOptimizedImageUrl(uri: string, size: object): string {
  const urlParameters = getBasicOptimizedUrlParameters(size)
  urlParameters.q = 'auto:best'
  return buildUrl(uri, urlParameters)
}

const imageUrlFactories = {
  basic: getBasicImageUrl,
  contentBlock: getContentBlockImage,
  avatar: getAvatarImageUrl,
  loading: getLoadingPreviewImageUrl,
  optimized: getOptimizedImageUrl,
}

export default function getImageUrl(image: object|string, type: string, size: object = {}): ?string {
  // TODO: If this is a video url, then the extension will be video and it has a different base (IE getVideoUrlBase)
  //    But not sure this case exists anymore?
  const uri = getUri(image)
  if (!uri) {
    return undefined
  }

  const imageSize = size || {}

  if (imageSize.width == 'screen') {
    imageSize.width = metrics.screenWidth
  }

  if (imageSize.height == 'screen') {
    imageSize.height = metrics.screenHeight
  }

  // TODO: Round to nearest number
  if (imageSize.width) {
    imageSize.width *= metrics.pixelRatio
  }

  if (imageSize.height) {
    imageSize.height *= metrics.pixelRatio
  }

  const urlFactory = imageUrlFactories[type] || getOptimizedImageUrl
  return urlFactory(uri, imageSize)
}
