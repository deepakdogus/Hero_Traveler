import getImageUrl from '../Shared/Lib/getImageUrl'
/*global FB*/
const branch = window.branch
const videoThumbnailOptions = {
  video: true,
  width: 385.5,
}

const SITE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : 'https://herotraveler.com/'

export const createDeepLinkWeb = async (feedItem, feedItemType) => {
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
    '$desktop_url': SITE_URL,
  }
  coverImage
    ? data['$og_image_url'] = coverMediaURL
    : data['$og_video'] = coverMediaURL

  const linkData = {
    channel: 'facebook',
    feature: 'share',
    data,
  }

  branch.link(linkData, (err, link) => {
    if (err) {
      console.error(`Share fail with error: ${err}`)
      return
    }

    FB.ui({
      method: 'share_open_graph',
      action_type: 'news.publishes',
      action_properties: JSON.stringify({
        article: {
          'fb:app_id': '1589340484457361',
          'og:title': title,
          'og:url': link,
          'og:description': description,
          'og:image': coverMediaURL,
          'al:ios:url': `com.herotraveler.herotraveler-beta://?${feedItemType}Id=${id}&title=${title}`,
          'al:web:should_fallback': 'false',
          'al:ios:app_store_id': '1288145566',
        },
      }),
    })
  })
}

export const oldCreateDeepLinkWeb = async (feedItem, feedItemType) => {
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
          'og:url': `https://herotraveler.com/${feedItemType}/${id}`,
          'og:description': description,
          'og:image': coverMediaURL,
          'al:ios:url': `com.herotraveler.herotraveler-beta://?${feedItemType}Id=${id}&title=${title}`,
          'al:web:should_fallback': 'false',
          'al:ios:app_store_id': '1288145566',
        },
      }),
    })
  }
