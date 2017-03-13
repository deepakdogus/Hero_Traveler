import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Scene, Router, Modal, NavBar, Switch, Actions as NavActions } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'


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
        <Scene key='drawer' component={Modal}>
          <Scene
            key='root'
            titleStyle={Styles.title}
            navigationBarStyle={Styles.navBarClear}
            backButtonTextStyle={Styles.navText}
            leftButtonTextStyle={Styles.navText}
            rightButtonTextStyle={Styles.navText}
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
              backTitle=' '
            />
            <Scene key='tabbar'
              tabs
              tabBarStyle={Styles.tabBar}
            >
              <Scene
                key='myFeed'
                initial
                icon={TabIcon}
                component={MyFeedScreen}
                title='Feed'
                navigationBarStyle={Styles.navBar}
                titleStyle={Styles.navBarTitle}
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
