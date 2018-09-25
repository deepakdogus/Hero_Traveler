import getImageUrl from './getImageUrl'
/*global FB*/
const videoThumbnailOptions = {
  video: true,
  width: 385.5,
}

export const createBranchLinkWeb = async (feedItem, feedItemType) => {
  const { id, coverImage, coverVideo, title, description } = feedItem
  const coverMediaURL = coverImage
  ? getImageUrl(coverImage)
  : getImageUrl(coverVideo, 'optimized', videoThumbnailOptions)
  console.log('coverMediaURL', coverMediaURL)

  FB.ui({
    method: 'share_open_graph',
    action_type: 'news.publishes',
    action_properties: JSON.stringify({
      article: {
        'fb:app_id': '1589340484457361',
        'og:title': title,
        'og:url': `http://localhost:3001/${feedItemType}/${id}`,
        'og:description': description,
        'og:image': coverMediaURL,
        "al:ios:url": `com.herotraveler.herotraveler-beta://?${feedItemType}Id=${id}&title=${title}`,
        "al:web:should_fallback": "false",
        "al:ios:app_store_id": "1288145566",
      }
    })
  })
}


