import branch from 'react-native-branch'
import { ShareDialog } from 'react-native-fbsdk'
import getImageUrl from '../Shared/Lib/getImageUrl'

//creates Branch Universal Object to be passed throught the Facebook Share Dialog
export const createBranchUniversalObj = async (title, contentImageUrl, contentDescription, feedItemId) => {
  const branchUniversalObject = await branch.createBranchUniversalObject('heroTravelerMobile', {
    locallyIndex: true,
    title,
    canonicalUrl: feedItemId,
    contentImageUrl,
    contentDescription,
  })

  const linkProperties = {
    feature: 'share',
    channel: 'facebook',
  }

  const controlParams = {
    $desktop_url: 'https://ht-web.herokuapp.com/'
  }

  const {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
  return url
}


export const shareLinkWithShareDialog = (contentUrl, contentDescription) => {
  const content = {
    contentType: 'link',
    contentUrl: contentUrl,
    contentDescription,
  }
  ShareDialog.canShow(content)
  .then(canShow => {
    if (canShow) {
      return ShareDialog.show(content)
    }
  })
  .then(res=> {
    if (res.isCancelled) {
      alert('Share cancelled')
    } else {
      alert('Share success')
    }
  },
  (err) => {
    alert('Share fail with error: ' + err)
  })
}

export const createShareDialog = async (feedItem, feedItemType) => {
  const videoThumbnailOptions = {
    video: true,
    width: 385.5,
  }
  const { coverImage, coverVideo, title, description, id } = feedItem
  let coverMediaURL = coverImage
  ? getImageUrl(coverImage)
  : getImageUrl(coverVideo, 'optimized', videoThumbnailOptions)
  let branchUrl =
  await createBranchUniversalObj(
    title,
    coverMediaURL,
    description,
    `${feedItemType}/${id}`)
  shareLinkWithShareDialog(branchUrl, description)
}

export const parseNonBranchURL = (url) => {
  const obj = {}
  url = url.split('//?')[1].split('&').slice(0,-1)
  url[1] = url[1].replace(/%20/g, " ")
  url.map(info => {
    info = info.split('=')
    obj[info[0]] = info[1]
  })
  return obj
}


