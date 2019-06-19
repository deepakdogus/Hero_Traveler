import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Images } from '../../Themes'

export function getSize(props, defaultOverride = '25px') {
  const switchStatement = props.size || props.type

  switch(switchStatement) {
    case 'avatar':
      return '30px'
    case 'small':
      return '15px'
    case 'mediumSmall':
      return '18px'
    case 'extraMedium':
      return '38px'
    case 'medium':
      return '50px'
    case 'large':
      return '62px'
    case 'larger':
      return '85px'
    case 'x-large':
      return '140px'
    default:
      return defaultOverride
  }
}

const StyledIcon = styled.img`
  width: ${props => getSize};
  height: ${props => getSize};
  margin: ${props => props.center ? 'auto' : 0};
  cursor: ${props => props.onClick ? 'pointer' : 'auto'};
`

export default class Icon extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
  }

  getIconName(navKey) {
    switch (navKey) {
      case 'pencil':
        return Images.iconPencil
      case 'pencilBlack':
        return Images.iconPencilBlack
      case 'gear':
        return Images.iconGear
      case 'date':
        return Images.iconDate
      case 'dateLarge':
        return Images.iconDateLarge
      case 'audio-on':
        return Images.iconAudioOn
      case 'audio-off':
        return Images.iconAudioOff
      case 'like':
        return Images.iconLike
      case 'like-large':
        return Images.iconLikeLarge
      case 'like-active':
        return Images.iconLikeActive
      case 'like-active-large':
        return Images.iconLikeActiveLarge
      case 'likeActiveWhite':
        return Images.iconLikeWhite
      case 'squareLike':
        return Images.iconSquareLikeInactive
      case 'squareLikeActive':
        return Images.iconSquareLikeActive
      case 'comment':
        return Images.iconComment
      case 'squareComment':
        return Images.iconSquareComment
      case 'bookmark':
        return Images.iconBookmark
      case 'bookmark-active':
        return Images.iconBookmarkActive
      case 'squareBookmark':
        return Images.iconSquareBookmark
      case 'squareBookmarkActive':
        return Images.iconSquareBookmarkActive
      case 'feedBookmark':
        return Images.iconFeedBookmark
      case 'feedBookmarkActive':
        return Images.iconFeedBookmarkActive
      case 'share':
        return Images.iconShare
      case 'location':
        return Images.iconLocation
      case 'locationLarge':
        return Images.iconLocationLarge
      case 'camera':
        return Images.iconEditImageCameraLarge
      case 'video-camera':
        return Images.iconEditVideo
      case 'arrowRight':
        return Images.iconArrowRight
      case 'arrowLeft':
        return Images.iconArrowLeft
      case 'arrowRightRed':
        return Images.iconArrowRightRed
      case 'arrowLeftRed':
        return Images.iconArrowLeftRed
      case 'redCheck':
        return Images.iconRedCheck
      case 'greyCheck':
        return Images.iconGreyCheck
      case 'facebook':
        return Images.iconLoginFacebook
      case 'facebook-blue-large':
        return Images.iconFacebookBlueLarge
      case 'facebookLarge':
        return Images.iconLoginFacebookLarge
      case 'facebook-blue':
        return Images.iconFacebook
      case 'facebookDark':
        return Images.iconFacebookDark
      case 'squareFacebookOutline':
        return Images.iconSquareFacebookOutline
      case 'twitter':
        return Images.iconTwitter
      case 'twitterDark':
        return Images.iconTwitterDark
      case 'twitterLarge':
        return Images.iconTwitterLarge
      case 'twitter-blue':
        return Images.iconTwitterBlue
      case 'squareTwitterOutline':
        return Images.iconSquareTwitterOutline
      case 'instagram':
        return Images.iconInstagram
      case 'instagramDark':
        return Images.iconInstagramDark
      case 'loginEmail':
        return Images.iconLoginEmail
      case 'myFeed':
        return Images.iconNavHome
      case 'activity':
        return Images.iconNavActivity
      case 'tag':
        return Images.iconTag
      case 'tagLarge':
        return Images.iconTagLarge
      case 'hashtag':
        return Images.iconHashtag
      case 'explore':
        return Images.iconNavExplore
      case 'search':
        return Images.iconNavExploreLarge
      case 'story':
        return Images.iconCreateMenuStory
      case 'createStory':
        return Images.iconNavCreate
      case 'createGuide':
        return Images.iconCreateGuide
      case 'hamburger':
        return Images.hamburger
      case 'close':
        return Images.iconContentXWhite
      case 'closeWhite':
        return Images.iconContentXWhiteLarge
      case 'closeDark':
        return Images.iconContentXDark
      case 'closeBlack':
        return Images.iconContentXBlack
      case 'add':
        return Images.iconContentPlusWhite
      case 'addLarge':
        return Images.iconContentPlusWhiteLarge
      case 'cameraReverse':
        return Images.iconReverseCamera
      case 'cameraFlash':
        return Images.iconFlashCamera
      case 'video':
        return Images.iconCreateMenuVideo
      case 'photo':
        return Images.iconCreateMenuPhoto
      case 'contributor':
        return Images.iconContributorBadge
      case 'founder':
        return Images.iconFounderBadge
      case 'fellow':
        return Images.iconFellowBadge
      case 'defaultProfile':
        return Images.iconDefaultProfileLarge
      case 'defaultProfileSmall':
        return Images.iconDefaultProfile
      case 'googlePlayBadge':
        return Images.googlePlayBadge
      case 'appleAppStoreBadge':
        return Images.appleAppStoreBadge
      case 'components':
        return Images.components
      case 'trash':
        return Images.iconEditImageTrash
      case 'trashLarge':
        return Images.iconEditImageTrashLarge
      case 'addCoverCamera':
        return Images.iconAddCoverCamera
      case 'google':
        return Images.iconSquareGoogleShare
      case 'dots':
        return Images.iconSquareDots
      case 'tumblr':
        return Images.iconSquareTumblr
      case 'pinterest':
        return Images.iconSquarePinterest
      case 'email':
        return Images.iconSquareEmail
      case 'report':
        return Images.iconSquareFlag
      case 'flag':
        return Images.iconFlag
      case 'cost':
        return Images.iconCost
      case 'costLarge':
        return Images.iconCostLarge
      case 'travelTips':
        return Images.iconTravelTips
      case 'guide':
        return Images.iconGuide
      case 'profile':
      case 'createSave':
        return Images.iconCreateSave
      case 'createSaveLarge':
        return Images.iconCreateSaveLarge
      case 'createPhoto':
        return Images.iconCreatePhoto
      case 'createVideo':
        return Images.iconCreateVideo
      case 'createAddCover':
        return Images.iconCreateAddCover
      case 'navNotifications':
        return Images.iconNavNotifications
      case 'iconHeaderNotifications':
        return Images.iconHeaderNotifications
      case 'iconHeaderProfile':
        return Images.iconHeaderProfile
      case 'info':
        return Images.iconInfoDark
      case 'infoLarge':
        return Images.iconInfoDarkLarge
      case 'ratingStarActive':
        return Images.iconStarRatingActive
      case 'ratingStarInactive':
        return Images.iconStarRatingInactive
      case 'addActionButton':
        return Images.iconAddButton
      case 'createPlus':
        return Images.iconCreatePlus
      default:
        return Images.iconNavProfile
    }
  }

  render() {
    return (
      <StyledIcon src={this.getIconName(this.props.name)} {...this.props}/>
    )
  }
}
