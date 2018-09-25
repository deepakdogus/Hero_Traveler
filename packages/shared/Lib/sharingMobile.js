import branch from 'react-native-branch'
import { ShareDialog } from 'react-native-fbsdk'

//creates Branch Universal Object to be passed throught the Facebook Share Dialog
export const createBranchUniversalObj = async (title, contentImageUrl,contentDescription, storyId) => {
  const branchUniversalObject = await branch.createBranchUniversalObject('heroTravelerMobile', {
    locallyIndex: true,
    title,
    canonicalUrl: storyId,
    contentImageUrl,
    contentDescription,
  })

  const linkProperties = {
    feature: 'share',
    channel: 'facebook',
  }

  const controlParams = {
    $desktop_url: 'https://ab5532da.ngrok.io'
  }

  const {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
  return url
}


export const shareLinkWithShareDialog = (contentUrl, contentDescription) => {
  const content = {
    contentType: 'link',
    contentUrl: contentUrl,
    contentDescription,
  };
  ShareDialog.canShow(content)
  .then(canShow => {
    console.log('canShow', canShow)
    if (canShow) {
      return ShareDialog.show(content)
    }
  })
  .then(res=> {
    if (res.isCancelled) {
      alert('Share cancelled')
    } else {
      alert('Share success)
    }
  },
  (err) => {
    alert('Share fail with error: ' + err)
  })
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


