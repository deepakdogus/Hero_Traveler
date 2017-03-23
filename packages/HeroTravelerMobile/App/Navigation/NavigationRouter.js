import React, { Component } from 'react'
import { Text } from 'react-native'
import {
  Scene,
  Router,
  Modal,
  Actions as NavActions
} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import SignupScreen from '../Containers/Signup/SignupScreen'
import LoginScreen from '../Containers/LoginScreen'
import Styles from './Styles/NavigationContainerStyles'

import MyFeedScreen from '../Containers/Tabs/MyFeedScreen'
import ExploreScreen from '../Containers/Tabs/ExploreScreen'
import CreateStoryScreen from '../Containers/CreateStory/CreateStoryScreen'
import PhotoStoryScreen from '../Containers/CreateStory/PhotoStoryScreen'
import CreateStoryDetailScreen from '../Containers/CreateStory/CreateStoryDetailScreen'
import ActivityScreen from '../Containers/Tabs/ActivityScreen'
import ProfileScreen from '../Containers/Tabs/ProfileScreen'
import SignupTopics from '../Containers/Signup/SignupTopics'
import SignupSocial from '../Containers/Signup/SignupSocial'
import PhotoSelectorScreen from '../Containers/CreateStory/PhotoSelectorScreen'
import PhotoTakerScreen from '../Containers/CreateStory/PhotoTakerScreen'
import SettingsScreen from '../Containers/SettingsScreen'

// https://github.com/aksonov/react-native-router-flux/blob/master/Example/Example.js#L52
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  return {}
}

class TabIcon extends React.Component {
  getIconName(navKey) {
    console.log('navKey', navKey)
    switch (navKey) {
      case 'myFeed':
        return 'home'
      case 'activity':
        return 'bolt'
      case 'explore':
        return 'search'
      case 'createStory':
       return 'plus'
      case 'profile':
        return 'user'
      default:
        return 'rocket'
    }
  }

  render(){
    return (
      <Icon
        name={this.getIconName(this.props.name)}
        size={20}
        color={this.props.selected ? 'white' : '#666666'}
      />
    );
  }
}

const darkNavBarProps = {
  navigationBarStyle: Styles.navBar,
  titleStyle: [Styles.navText, Styles.navText],
  backButtonTextStyle: Styles.navText,
  leftButtonTextStyle: Styles.navText,
  rightButtonTextStyle: Styles.navText
}

const clearNavBarProps = {
  navigationBarStyle: Styles.navBarClear,
  titleStyle: [Styles.navText, Styles.navTitle],
  backButtonTextStyle: Styles.navText,
  leftButtonTextStyle: Styles.navText,
  rightButtonTextStyle: Styles.navText
}

const tabBarProps = {
  tabs: true,
  tabBarStyle: Styles.tabBar
}

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  constructor (props) {
    super(props)
    this.renderLeftButton = this.renderLeftButton.bind(this)
  }

  renderLeftButton (arg) {
    console.log('it is ', arg)
  }

  render () {
    return (
      <Router getSceneStyle={getSceneStyle}>
        <Scene key='drawer' component={Modal}>
          <Scene
            key='root'
            {...clearNavBarProps}
          >
            <Scene
              initial
              key='launchScreen'
              component={LaunchScreen}
              rightTitle='Browse as a Guest >'
              rightButtonTextStyle={Styles.browseGuest}
              onRight={() => alert('TODO Browse as guest')}
            />
            <Scene
              key='signup'
              component={SignupScreen}
            />
            <Scene
              key='signupFlow'
              {...darkNavBarProps}
            >
              <Scene
                initial
                key='signupFlow_topics'
                component={SignupTopics}
                rightTitle='Next'
                onRight={() => NavActions.signupFlow_social()}
              />
              <Scene
                key='signupFlow_social'
                component={SignupSocial}
                rightTitle='Done'
                onRight={() => NavActions.tabbar()}
              />
            </Scene>
            <Scene
              key='login'
              component={LoginScreen}
            />
            <Scene
              key='settings'
              component={SettingsScreen}
              direction='horizontal'
              onLeft={() => NavActions.pop()}
              title='Settings'
              {...darkNavBarProps}
            />
            <Scene key='tabbar'
              {...tabBarProps}
            >
              <Scene
                key='myFeed'
                initial
                icon={TabIcon}
                component={MyFeedScreen}
                title='Feed'
                renderBackButton={() => null}
                {...darkNavBarProps}
              />
              <Scene
                key='explore'
                icon={TabIcon}
                component={ExploreScreen}
                title='Explore'
                {...darkNavBarProps}
                hideNavBar={true}
              />
              <Scene
                key='createStory'
                title='Create Story'
                icon={TabIcon}
                onPress={() => NavActions.createStoryFlow()}
              />
              <Scene
                key='activity'
                icon={TabIcon}
                component={ActivityScreen}
                title='Activity'
                {...darkNavBarProps}
              />
              <Scene
                key='profile'
                icon={TabIcon}
                component={ProfileScreen}
                hideNavBar
              />
            </Scene>
            <Scene
              key='createStoryFlow'
              direction='vertical'
              {...darkNavBarProps}
            >
              <Scene
                key='createStory_info'
                title='Create Story'
                hideNavBar={true}
                component={CreateStoryScreen}
              />
              <Scene
                key='createStory_photo'
                title='Create Story'
                component={PhotoStoryScreen}
                panHandlers={null}
                hideNavBar={false}
                type="replace"
                direction="horizontal"
                leftTitle='Cancel'
                onLeft={() => NavActions.pop()}
                rightTitle='Next'
                onRight={() => NavActions.createStory_details()}
              />
              <Scene
                key='createStory_details'
                title='Create Story Details'
                panHandlers={null}
                component={CreateStoryDetailScreen}
                backTitle='Cancel'
                rightTitle='Publish'
                onRight={() => console.log('Publishing')}
              />
            </Scene>
            <Scene
              key='photoSelectorScreen'
              {...tabBarProps}
            >
              <Scene
                key='selectPhoto'
                panHandlers={null}
                title='Library'
                icon={TabIcon}
                component={PhotoSelectorScreen}
                leftTitle='Cancel'
                onLeft={() => NavActions.pop()}
                {...darkNavBarProps}
              />
              <Scene
                initial
                key='takePhoto'
                panHandlers={null}
                title='Photo'
                icon={TabIcon}
                backTitle='Cancel'
                hideBackImage
                {...darkNavBarProps}
                leftTitle='Cancel'
                onLeft={() => NavActions.pop()}
                component={PhotoTakerScreen}
              />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    )
  }
}

/* navigationBarStyle={Styles.navBar}
    renderLeftButton={this.renderLeftButton}
    leftButtonIconStyle={Styles.leftButton}
    rightButtonTextStyle={Styles.rightButton} */

export default NavigationRouter
