import React from 'react'
import PropTypes from 'prop-types'
import {View, Image} from 'react-native'
import _ from 'lodash'
import {connect} from 'react-redux'
import {Images} from '../Shared/Themes'

import NotificationBadge from './NotificationBadge'

class TabIcon extends React.Component {

  getIconSource(name) {
    switch (name) {
      case 'pencil':
        return Images.iconPencil
      case 'pencilOutline':
        return Images.iconPencilOutline
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
      case 'cameraWhite':
        return Images.iconAddCoverCameraWhite
      case 'cameraDark':
        return Images.iconAddCoverCamera
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
      case 'redCheckOutlined':
        return Images.iconRedCheckOutlined
      case 'facebook':
        return Images.iconLoginFacebookOld
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
      case 'hashtag':
        return Images.iconHashtag
      case 'travelTips':
        return Images.iconTravelTips
      case 'cost':
        return Images.iconCost
      case 'explore':
        return Images.iconNavExplore
      case 'createMenuStory':
        return Images.iconCreateMenuStory
      case 'createStory':
        return Images.iconNavCreate
      case 'close':
        return Images.iconContentXWhite
      case 'closeDark':
        return Images.iconContentXDark
      case 'closeGrey':
        return Images.iconClose
      case 'cameraReverse':
        return Images.iconReverseCamera
      case 'cameraFlash':
        return Images.iconFlashCamera
      case 'video':
        return Images.iconCreateMenuVideo
      case 'videoWhite':
        return Images.iconWhiteVideo
      case 'trash':
        return Images.iconTrash
      case 'trashBlack':
        return Images.iconTrashBlack
      case 'normalText':
        return Images.iconNormalText
      case 'headerText':
        return Images.iconHeaderText
      case 'flag':
        return Images.iconFlag
      case 'contributor':
        return Images.iconContributorBadge
      case 'founder':
        return Images.iconFounderBadge
      case 'fellow':
        return Images.iconFellowBadge
      case 'error':
        return Images.iconErrorExclamation
      case 'info':
        return Images.iconInfoDark
      case 'profile':
      default:
        return Images.iconNavProfile
    }
  }

  static propTypes = {
    name: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    notificationCount: PropTypes.number,
  }

  render() {
    const { style = {}, name, notificationCount } = this.props
    return (
      <View
        style={style.view}
      >
        <Image
          source={this.getIconSource(name)}
          style={style.image || {}}
        />
        {name === 'activity' && notificationCount > 0 &&
          <NotificationBadge count={notificationCount} />
        }
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  if (props.name === 'activity') {
    const activities = state.entities.users.activities
    const unseenActivityCount = _.keys(activities).reduce((count, key) => {
      const increment = activities[key].seen ? 0 : 1;
      return count + increment;
    }, 0)

    /*
      We will need a similar logic once we add message threads.
      So notificationCount will be unseenActivityCount + unreadThreadCount
    */
    return { notificationCount: unseenActivityCount}
  }
  return {
    notificationCount: 0,
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TabIcon)
