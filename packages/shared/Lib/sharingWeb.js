import getImageUrl from './getImageUrl'
/*global FB*/
const videoThumbnailOptions = {
  video: true,
  width: 385.5,
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


