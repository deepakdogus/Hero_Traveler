import _ from 'lodash'
import Env from '../../Config/Env'
import {getVideoUrlBase, isLocalMediaAsset} from './getVideoUrl'
import metrics from '../Themes/Metrics'

function isFromFacebook(image) {
  return typeof(image) === 'object'
    && _.has(image, ['original', 'folders'])
    && image.original.folders.includes('facebook')
}

function getImageUrlBase(image) {
  const base = `https://res.cloudinary.com/${Env.cloudName}/image`
  if (isFromFacebook(image)) return `${base}/facebook`
  return `${base}/upload`
}

function buildParameters(urlParameters) {
  return _.map(_.toPairs(urlParameters || {}), function(pair) {
    return `${pair[0]}_${pair[1]}`
  })
}

function buildUrl(base: string, uri: string, urlParameters: object): string {
  const parameters = buildParameters(urlParameters)

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

function getUri(image: object|string, type: string): ?string {
  if (!image) {
    return undefined
  }

  if (typeof(image) === 'string') {
    return ensureJpgExtension(image)
  } else if (typeof(image) === 'object' && _.has(image, 'original')) {
    const target = type === 'gridItemThumbnail'
      ? image.versions.thumbnail240
      : image.original
    let {path, folders} = target
    if (!path) {
      return undefined
    }

    const filename = ensureJpgExtension(_.last(path.split('/')))
    if (isFromFacebook(image)) return filename

    // hot fix to avoid search crashing. Need to bulk update algolia
    const folderPath = folders && !_.isEmpty(folders) ? folders.join('/') : 'files'
    return `${folderPath}/${filename}`
  }

  return undefined
}

function getBasicOptimizedUrlParameters(size: object) {
  const urlParameters = {
    f: 'auto',
  }

  if (size.width && size.height) {
    urlParameters.c = 'fill'
  }

  if (size.width) {
    urlParameters.w = `${size.width}`
  }

  if (size.height) {
    urlParameters.h = `${size.height}`
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
  return {
    f: 'auto',
    c: 'fill',
    g: 'faces',
    q: 'auto:best',
    w: '85',
    h: '85',
  }
}

function getLargeAvatarImageUrlParameters(size: object): string {
  return _.merge({}, getAvatarImageUrlParameters(), {
    w: '190',
    h: '190',
  })
}

function getNotificationImageUrlParameters(){
  return {
    f: 'auto',
    c: 'fit',
    w: '100',
    h: '100',
  }
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
  thumbnail: getNotificationImageUrlParameters,
  avatarLarge: getLargeAvatarImageUrlParameters
}

// hacky way to extract the url for images that get uploaded to Cloudinary but not DB
// will look to refactor
function midSyncSpecialCase(image, type){
    const urlParametersFactory = imageUrlParametersFactories[type] || getOptimizedImageUrlParameters
    const urlParameters = urlParametersFactory(image)
    let parameters = buildParameters(urlParameters).join(",")

    let orignalUrl = image.uri || image.secure_url
    if (!parameters.length) return orignalUrl

    orignalUrl = orignalUrl.split("/")
    orignalUrl[6] = parameters
    let lastArrayItem = orignalUrl[orignalUrl.length-1].split('.')
    lastArrayItem[1] = 'jpg'
    orignalUrl[orignalUrl.length-1] = lastArrayItem.join('.')
    return orignalUrl.join("/")

}

export default function getImageUrl(image: object|string, type: string, options: object = {}): ?string {
  if (isLocalMediaAsset(image) || (image && image.uri)) return image.uri || image

  // special cases where image has not been fully synced
  if (!!image && (!!image.uri || !!image.secure_url)) {
    return midSyncSpecialCase(image, type)
  }

  const uri = getUri(image, type)
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

  const base = options.video ? getVideoUrlBase() : getImageUrlBase(image)
  const urlParametersFactory = imageUrlParametersFactories[type] || getOptimizedImageUrlParameters
  const urlParameters = urlParametersFactory(imageSize)
  return buildUrl(base, uri, urlParameters)
}
