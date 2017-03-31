import React, { Component } from 'react'
import { Text } from 'react-native'
import {
  Scene,
  Router,
  Modal,
  Actions as NavActions
} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import LaunchScreen from '../Containers/LaunchScreen'
import Styles from './Styles/NavigationContainerStyles'

// Tabs
import MyFeedScreen from '../Containers/Tabs/MyFeedScreen'
import ExploreScreen from '../Containers/Tabs/ExploreScreen'
// Profile tab
import ProfileScreen from '../Containers/Tabs/ProfileScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import CategoryFeedScreen from '../Containers/Explore/CategoryFeedScreen'

// Story reading & creating
import StoryReadingScreen from '../Containers/StoryReadingScreen'
import StoryCommentsScreen from '../Containers/StoryCommentsScreen'
import StoryCoverScreen from '../Containers/CreateStory/StoryCoverScreen'
import StoryCreateScreen from '../Containers/CreateStory/CreateStoryScreen'
import FullScreenEditor from '../Containers/CreateStory/FullScreenEditor'
import CreateStoryDetailScreen from '../Containers/CreateStory/CreateStoryDetailScreen'
import MediaSelectorScreen from '../Containers/MediaSelectorScreen'

import ActivityScreen from '../Containers/Tabs/ActivityScreen'

// Signup & login
import LoginScreen from '../Containers/LoginScreen'
import SignupScreen from '../Containers/Signup/SignupScreen'
import SignupTopics from '../Containers/Signup/SignupTopics'
import SignupSocial from '../Containers/Signup/SignupSocial'

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
      default:
        return 'rocket'
    }
  }

  render(){
    console.log('TabIcon props', this.props)
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
            <Scene
              key='categoryFeed'
              component={CategoryFeedScreen}
              direction='horizontal'
              onLeft={() => NavActions.pop()}
              title='Category Feed'
              {...darkNavBarProps}
            />
            <Scene
              key='story'
              component={StoryReadingScreen}
              direction='horizontal'
              onLeft={() => NavActions.pop()}
              title='Story Read'
              {...darkNavBarProps}
            />
            <Scene
              key='storyComments'
              component={StoryCommentsScreen}
              direction='horizontal'
              onLeft={() => NavActions.pop()}
              title='Comments'
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
                component={StoryCreateScreen}
              />
              <Scene
                key='createStory_photo'
                title='Create Story'
                component={StoryCoverScreen}
                panHandlers={null}
                hideNavBar={false}
                type="replace"
                direction="horizontal"
                leftTitle='Cancel'
                onLeft={() => NavActions.pop()}
                rightTitle='Next'
                onRight={() => NavActions.createStory_content()}
              />
              <Scene
                key='createStory_content'
                title='Story Content'
                component={FullScreenEditor}
                panHandlers={null}
                direction='horizontal'
                leftTitle='Back'
                onLeft={() => NavActions.pop()}
                rightTitle='Next'
                onRight={() => NavActions.createStory_details()}
              />
              <Scene
                key='createStory_details'
                title='Create Story Details'
                panHandlers={null}
                hideNavBar={false}
                component={CreateStoryDetailScreen}
                backTitle='Cancel'
                rightTitle='Publish'
                onRight={() => console.log('Publishing')}
              />
            </Scene>
            <Scene
              key='mediaSelectorScreen'
              component={MediaSelectorScreen}
              backTitle='Cancel'
              rightTitle='Publish'
              onRight={() => console.log('Publishing')}
              direction='horizontal'
              {...darkNavBarProps}
            />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
