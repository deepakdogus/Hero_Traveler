import React from 'react'
import {View, Image, Text} from 'react-native'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Images} from '../Themes'

import NotificationBadge from './NotificationBadge'

class TabIcon extends React.Component {

  getIconName(navKey) {
    switch (navKey) {
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

  render() {
    return (
      <View style={this.props.style || {}}>
        <Image
          source={this.getIconName(this.props.name)}
          size={40}
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