import getImageUrl from '../Shared/Lib/getImageUrl'
import env from '../Config/Env'

const branch = window.branch

/*global FB*/
const videoThumbnailOptions = {
  video: true,
  width: 385.5,
}

const popupCenter = (url, title, w, h) => {
  // Fixes dual-screen position
  const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX
  const dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  
  window.open(url, title, `toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=1,width=${w},height=${h},top=${top},left=${left}`)
}

const generateShareDataFromItem = (feedItem, feedItemType) => {
  const { id, coverImage, coverVideo, title, description } = feedItem
  const coverMediaURL = coverImage
  ? getImageUrl(coverImage)
  : getImageUrl(coverVideo, 'optimized', videoThumbnailOptions)

  const data = {
    '$og_title': title,
    '$og_type': 'website',
    '$og_description': description,
    '$canonical_url': `${feedItemType}/${id}`,
    '$canonical_identifier': 'heroTravelerWeb',
    '$locally_indexable': true,
    '$desktop_url': env.SITE_URL,
  }

  coverImage
    ? data['$og_image_url'] = coverMediaURL
    : data['$og_video'] = coverMediaURL

  return data
}

export const createDeepLinkWeb = async (feedItem, feedItemType) => {
  const { id, coverImage, coverVideo, title, description } = feedItem
  const coverMediaURL = coverImage
  ? getImageUrl(coverImage)
  : getImageUrl(coverVideo, 'optimized', videoThumbnailOptions)

  FB.ui({
    method: 'share_open_graph',
    action_type: 'news.publishes',
    action_properties: JSON.stringify({
      article: {
        'fb:app_id': '1589340484457361',
        'og:title': title,
        'og:url': `https://ht-web.herokuapp.com/${feedItemType}/${id}`,
        'og:description': description,
        'og:image': coverMediaURL,
        "al:ios:url": `com.herotraveler.herotraveler-beta://?${feedItemType}Id=${id}&title=${title}`,
        "al:web:should_fallback": "false",
        "al:ios:app_store_id": "1288145566",
      }
    })
  })
}

export const shareLinkOnTwitter = (feedItem, feedItemType) => {
  const data = generateShareDataFromItem(feedItem, feedItemType)

  const linkData = {
    channel: 'twitter',
    feature: 'share',
    data,
  }

  branch.link(linkData, (err, link) => {
    if (err) {
      console.error(`Share fail with error: ${err}`)
    }
    const twitterUrl = `https://twitter.com/share?url=${link}&amp;text=Check this story&amp;hashtags=`
    // popup settings
    const width = 550
    const height = 285
    popupCenter(twitterUrl, 'Twitter', width, height)
  })
}

export const shareLinkOnEmail = (feedItem, feedItemType) => {
  const data = generateShareDataFromItem(feedItem, feedItemType)

  const linkData = {
    channel: 'email',
    feature: 'share',
    data,
  }

  branch.link(linkData, (err, link) => {
    if (err) {
      console.error(`Share fail with error: ${err}`)
    }
    window.location = `mailto:?subject=${feedItem.title}&body=Check out this story ${link} I saw on HeroTraveler: ${feedItem.description || feedItem.title}`
  })
}
