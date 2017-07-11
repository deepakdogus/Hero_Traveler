import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {Images} from '../Shared/Themes'

const StyledIcon = styled.img`
	width: 25px;
	height: 25px;
`

export default class Icon extends React.Component {
	static propTypes = {
    name: PropTypes.string,
  }

	getIconName(navKey) {
    switch (navKey) {
      case 'pencil':
        return Images.iconPencil
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
      case 'comment':
        return Images.iconComment
      case 'bookmark':
        return Images.iconBookmark
      case 'bookmark-active':
        return Images.iconBookmarkActive
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
      case 'twitter':
        return Images.iconTwitter
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
      case 'createStory':
        return Images.iconNavCreate
      case 'close':
        return Images.iconContentXWhite
      case 'cameraReverse':
        return Images.iconReverseCamera
      case 'cameraFlash':
        return Images.iconFlashCamera
      case 'video':
        return Images.iconCreateMenuVideo
      case 'profile':
      default:
        return Images.iconNavProfile
    }
  }

  render() {
    return (   
      <StyledIcon src={this.getIconName(this.props.name)}/>
    )
  }
}