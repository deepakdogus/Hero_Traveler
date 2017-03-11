import React, { Component } from 'react'
import { Text } from 'react-native'
import { Scene, Router, Modal, NavBar } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'
import NavigationDrawer from './NavigationDrawer'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import SignupScreen from '../Containers/SignupScreen'
import MyFeedScreen from '../Containers/MyFeedScreen'
import ExploreScreen from '../Containers/ExploreScreen'
import NewStoryScreen from '../Containers/NewStoryScreen'
import ActivityScreen from '../Containers/ActivityScreen'
import ProfileScreen from '../Containers/ProfileScreen'

// https://github.com/aksonov/react-native-router-flux/blob/master/Example/Example.js#L52
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  return {}
}

class TabIcon extends React.Component {
  render(){
    return (
      <Text style={{color: this.props.selected ? 'red' : 'white'}}>{this.props.title}</Text>
    );
  }
}

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router getSceneStyle={getSceneStyle}>
        <Scene key='drawer' component={Modal} open={false}>
          <Scene
            key='root'
            titleStyle={Styles.title}
            navBar={NavBar}
            navigationBarStyle={Styles.navBar}
            leftButtonIconStyle={Styles.leftButton}
            rightButtonTextStyle={Styles.rightButton}
          >
            <Scene initial key='launchScreen' component={LaunchScreen} title='LaunchScreen' hideNavBar />
            <Scene
              key='signup'
              component={SignupScreen}
              title='Signup'
              hideNavBar
            />
            <Scene key='tabbar'
              tabs
              navigationBarStyle={Styles.navBar}
              tabBarStyle={Styles.tabBar}
            >
              <Scene
                key='myFeed'
                initial
                icon={TabIcon}
                component={MyFeedScreen}
                title='Feed'
              />
              <Scene
                key='explore'
                icon={TabIcon}
                component={ExploreScreen}
                title='Explore'
              />
              <Scene
                key='createStory'
                icon={TabIcon}
                component={NewStoryScreen}
                title='New Story'
              />
              <Scene
                key='activity'
                icon={TabIcon}
                component={ActivityScreen}
                title='Activity'
              />
              <Scene
                key='profile'
                icon={TabIcon}
                component={ProfileScreen}
                title='Profile'
              />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
