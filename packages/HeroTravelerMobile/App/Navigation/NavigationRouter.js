import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Scene, Router, Modal, NavBar, Switch, Actions as NavActions } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import SignupScreen from '../Containers/SignupScreen'
import LoginScreen from '../Containers/LoginScreen'
import MyFeedScreen from '../Containers/MyFeedScreen'
import ExploreScreen from '../Containers/ExploreScreen'
import NewStoryScreen from '../Containers/NewStoryScreen'
import ActivityScreen from '../Containers/ActivityScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import SignupTopics from '../Containers/SignupTopics'
import SignupSocial from '../Containers/SignupSocial'

// https://github.com/aksonov/react-native-router-flux/blob/master/Example/Example.js#L52
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  return {}
}

class TabIcon extends React.Component {

  getIconName(navKey) {
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
              navigationBarStyle={Styles.navBar}
            >
              <Scene
                key='signupFlow_topics'
                component={SignupTopics}
                title='Welcome!'
                rightTitle='Next'
                onRight={() => NavActions.signupFlow_social()}
              />
              <Scene
                key='signupFlow_social'
                component={SignupSocial}
                title='Follow'
                rightTitle='Done'
                onRight={() => NavActions.tabbar()}
              />
            </Scene>
            <Scene
              key='login'
              component={LoginScreen}
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
              />
              <Scene
                key='createStory'
                icon={TabIcon}
                component={NewStoryScreen}
                title='New Story'
                {...darkNavBarProps}
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
                title='Profile'
                {...darkNavBarProps}
              />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
