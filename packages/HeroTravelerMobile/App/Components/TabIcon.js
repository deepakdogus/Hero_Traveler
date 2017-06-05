import React, { PropTypes } from 'react'
import {View, Image, Text} from 'react-native'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Images} from '../Themes'

import NotificationBadge from './NotificationBadge'

class TabIcon extends React.Component {

  getIconName(navKey) {
    switch (navKey) {
      case 'pencil':
        return Images.iconPencil
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
      case 'loginFacebook':
        return Images.iconLoginFacebook
      case 'loginEmail':
        return Images.iconLoginEmail
      case 'myFeed':
        return Images.iconNavHome
      case 'activity':
        return Images.iconNavActivity
      case 'explore':
        return Images.iconNavExplore
      case 'createStory':
        return Images.iconNavCreate
      case 'profile':
      default:
        return Images.iconNavProfile
    }
  }

  static propTypes = {
    name: PropTypes.string,
    // style: PropTypes.object,
    notificationCount: PropTypes.number,
  }

  render() {
    const { style = {} } = this.props
    return (
      <View style={ style.view || {} }>
        <Image
          source={this.getIconName(this.props.name)}
          size={40}
          style={style.image || {}}
          color={'white'}
        />
        {this.props.name === 'activity' && this.props.notificationCount > 0 &&
          <NotificationBadge count={this.props.notificationCount} />
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notificationCount: __DEV__ ? 4 : 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabIcon)
