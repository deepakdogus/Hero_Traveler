import _ from 'lodash'
import Env from '../../Config/Env'
import {getVideoUrlBase} from './getVideoUrl'
import metrics from '../Themes/Metrics'

function getImageUrlBase() {
  return `https://res.cloudinary.com/${Env.cloudName}/image/upload`
}

function buildUrl(base: string, uri: string, urlParameters: object): string {
  const parameters = _.map(_.toPairs(urlParameters || {}), function(pair) {
    return `${pair[0]}_${pair[1]}`
  })

  if (parameters.length > 0) {
    const parameterString = parameters.join(',')
    return `${base}/${parameterString}/${uri}`
  }

  return `${base}/${uri}`
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

  if (typeof(image) === 'string') {
    return ensureJpgExtension(image)
  } else if (typeof(image) === 'object' && _.has(image, 'original')) {
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

function getContentBlockImageParameters(size: object): string {
  return {q: 'auto:best', f: 'auto'}
}

function getBasicImageUrlParameters(size: object): string {
  return {}
}

function getAvatarImageUrlParameters(size: object): string {
  return {}
}

function getLoadingPreviewImageUrlParameters(size: object): string {
  if (size.width) {
    size.width = Math.round(size.width/4)
  }
  if (size.height) {
    size.height = Math.round(size.height/4)
  }

  const urlParameters = getBasicOptimizedUrlParameters(size)
  urlParameters.q = 'auto:low'
  urlParameters.e = 'blur:5000'
  return urlParameters
}

function getOptimizedImageUrlParameters(size: object): string {
  const urlParameters = getBasicOptimizedUrlParameters(size)
  urlParameters.q = 'auto:best'
  return urlParameters
}

const imageUrlParametersFactories = {
  basic: getBasicImageUrlParameters,
  contentBlock: getContentBlockImageParameters,
  avatar: getAvatarImageUrlParameters,
  loading: getLoadingPreviewImageUrlParameters,
  optimized: getOptimizedImageUrlParameters,
}

export default function getImageUrl(image: object|string, type: string, options: object = {}): ?string {
  // special cases where image has not been fully synced
  if (!!image && (!!image.uri || !!image.secure_url)) return image.uri || image.secure_url
  if (
    typeof image === 'string' &&
    (image.substring(0,7) === 'file://' || image.substring(0,6) === '/Users')
  ) return image

  const uri = getUri(image)
  if (!uri) {
    return undefined
  }

  const imageSize = {}

  if (options.width === 'screen') {
    imageSize.width = Math.round(metrics.screenWidth * metrics.pixelRatio)
  } else if (options.width) {
    imageSize.width = Math.round(options.width * metrics.pixelRatio)
  }

  if (options.height === 'screen') {
    imageSize.height = Math.round(metrics.screenHeight * metrics.pixelRatio)
  } else if (options.height) {
    imageSize.height = Math.round(options.height * metrics.pixelRatio)
  }

  const base = type === options.video ? getVideoUrlBase() : getImageUrlBase()
  const urlParametersFactory = imageUrlParametersFactories[type] || getOptimizedImageUrlParameters
  const urlParameters = urlParametersFactory(imageSize)
  return buildUrl(base, uri, urlParameters)
}
