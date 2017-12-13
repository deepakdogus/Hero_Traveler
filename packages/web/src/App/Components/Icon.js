import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {Images} from '../Shared/Themes'

export function getSize(props) {
  switch(props.size) {
    case 'avatar':
      return '30px'
    case 'small':
      return '15px'
    case 'mediumSmall':
      return '18px'
    case 'medium':
      return '50px'
    case 'large':
      return '62px'
    case 'larger':
      return '85px'
    case 'x-large':
      return '112px'
    default:
      return '25px'
  }
}

const StyledIcon = styled.img`
  width: ${props => getSize};
  height: ${props => getSize};
  margin: ${props => props.center ? 'auto' : 0};
  cursor: ${props => props.onClick ? 'pointer' : 'auto'}
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
      case 'audio-on':
        return Images.iconAudioOn
      case 'audio-off':
        return Images.iconAudioOff
      case 'like':
        return Images.iconLike
      case 'like-active':
        return Images.iconLikeActive
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
      case 'share':
        return Images.iconShare
      case 'location':
        return Images.iconLocation
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
      case 'facebook':
        return Images.iconLoginFacebook
      case 'facebookLarge':
        return Images.iconLoginFacebookLarge
      case 'facebook-blue':
        return Images.iconFacebook
      case 'squareFacebookOutline':
        return Images.iconSquareFacebookOutline
      case 'twitter':
        return Images.iconTwitter
      case 'twitterLarge':
        return Images.iconTwitterLarge
      case 'twitter-blue':
        return Images.iconTwitterBlue
      case 'squareTwitterOutline':
        return Images.iconSquareTwitterOutline
      case 'instagram':
        return Images.iconInstagram
      case 'loginEmail':
        return Images.iconLoginEmail
      case 'myFeed':
        return Images.iconNavHome
      case 'activity':
        return Images.iconNavActivity
      case 'tag':
        return Images.iconTag
      case 'explore':
        return Images.iconNavExplore
      case 'story':
        return Images.iconCreateMenuStory
      case 'createStory':
        return Images.iconNavCreate
      case 'hamburger':
        return Images.hamburger
      case 'close':
        return Images.iconContentXWhite
      case 'closeDark':
        return Images.iconContentXDark
      case 'add':
        return Images.iconContentPlusWhite
      case 'cameraReverse':
        return Images.iconReverseCamera
      case 'cameraFlash':
        return Images.iconFlashCamera
      case 'video':
        return Images.iconCreateMenuVideo
      case 'photo':
        return Images.iconCreateMenuPhoto
      case 'profileBadge':
        return Images.iconProfileBadge
      case 'defaultProfile':
        return Images.iconDefaultProfile
      case 'googlePlayBadge':
        return Images.googlePlayBadge
      case 'appleAppStoreBadge':
        return Images.appleAppStoreBadge
      case 'components':
        return Images.components
      case 'trash':
        return Images.iconEditImageTrash
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
      case 'profile':
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
