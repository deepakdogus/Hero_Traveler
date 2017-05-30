import React, { Component } from 'react'
import {
  Scene,
  Modal,
  Actions as NavActions
} from 'react-native-router-flux'

import LaunchScreen from '../Containers/LaunchScreen'
import Styles from './Styles/NavigationContainerStyles'

// Tabs
import MyFeedScreen from '../Containers/Tabs/MyFeedScreen'
import ExploreScreen from '../Containers/Tabs/ExploreScreen'
import TabIcon from '../Components/Tab'
// Profile tab
import ProfileScreen from '../Containers/Tabs/ProfileScreen'
import ReadOnlyProfileScreen from '../Containers/ReadOnlyProfileScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import Settings_NotificationScreen from '../Containers/Settings_NotificationScreen'
import CategoryFeedScreen from '../Containers/Explore/CategoryFeedScreen'
import FollowersScreen from '../Containers/FollowersScreen'
import ViewBioScreen from '../Components/ViewBioScreen'
// import FollowingScreen from '../Containers/FollowingScreen'

// Info Screens
import TermsAndConditionsScreen from '../Containers/TermsAndConditionsScreen'
import FAQScreen from '../Containers/FAQScreen'
import PrivacyScreen from '../Components/PrivacyScreen'
import ChangePasswordScreen from '../Containers/ChangePasswordScreen'


// Story reading & creating
import StoryReadingScreen from '../Containers/StoryReadingScreen'
import StoryCommentsScreen from '../Containers/StoryCommentsScreen'
import StoryCreateScreen from '../Containers/CreateStory/1_CreateStoryScreen'
import StoryCoverScreen from '../Containers/CreateStory/2_StoryCoverScreen'
import FullScreenEditor from '../Containers/CreateStory/3_FullScreenEditor'
import CreateStoryDetailScreen from '../Containers/CreateStory/4_CreateStoryDetailScreen'
import TagScreen from '../Containers/CreateStory/TagScreen'
import MediaSelectorScreen from '../Containers/MediaSelectorScreen'

import ActivityScreen from '../Containers/Tabs/ActivityScreen'

// Signup & login
import LoginScreen from '../Containers/LoginScreen'
import ResetPasswordRequestScreen from '../Containers/ResetPasswordRequestScreen'
import ResetPasswordScreen from '../Containers/ResetPasswordScreen'
import SignupScreen from '../Containers/Signup/SignupScreen'
import SignupTopics from '../Containers/Signup/SignupTopics'
import SignupSocial from '../Containers/Signup/SignupSocial'
import Colors from '../Themes/Colors'
import {connect} from 'react-redux'
import {Text, View} from 'react-native'

// https://github.com/aksonov/react-native-router-flux/blob/master/Example/Example.js#L52
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  return {}
}

const darkNavBarProps = {
  navigationBarStyle: Styles.navBar,
  titleStyle: [Styles.navText, Styles.navTitle],
  backButtonTextStyle: Styles.navText,
  leftButtonTextStyle: Styles.navText,
  rightButtonTextStyle: Styles.navText,
  leftButtonIconStyle: Styles.navBarBack,
  rightButtonIconStyle: Styles.navBarBack
}

const clearNavBarProps = {
  navigationBarStyle: Styles.navBarClear,
  titleStyle: [Styles.navText, Styles.navTitle],
  backButtonTextStyle: Styles.navText,
  leftButtonTextStyle: Styles.navText,
  rightButtonTextStyle: Styles.navText,
  leftButtonIconStyle: Styles.navBarBack,
  rightButtonIconStyle: Styles.navBarBack,
}

const tabBarProps = {
  tabs: true,
  tabBarStyle: Styles.tabBar,
  tabBarSelectedItemStyle: Styles.tabBarActive
}

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/
export default NavActions.create(
    <Scene
      key='root'
      {...clearNavBarProps}
    >
      <Scene
        key='launchScreen'
        component={LaunchScreen}
        rightTitle='Browse as a Guest >'
        rightButtonTextStyle={Styles.browseGuest}
        onRight={() => __DEV__ ? NavActions.guestExplore() : alert('Browse as guest')}
        hideNavBar={false}
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
          rightButtonTextStyle={Styles.doneFollow}
          onRight={() => NavActions.tabbar()}
        />
      </Scene>
      <Scene
        key='login'
        component={LoginScreen}
      />
      <Scene
        key='resetPasswordRequest'
        component={ResetPasswordRequestScreen}
      />
      <Scene
        key='changePassword'
        component={ChangePasswordScreen}
        direction='horizontal'
        onLeft={() => NavActions.pop()}
        title='Change Password'
        {...darkNavBarProps}
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
        key='settings_notification'
        component={Settings_NotificationScreen}
        direction='horizontal'
        onLeft={() => NavActions.pop()}
        title='Notifications'
        {...darkNavBarProps}
      />
      <Scene
        key='terms'
        component={TermsAndConditionsScreen}
        direction='horizontal'
        onLeft={() => NavActions.pop()}
        title='Terms & Conditions'
        {...darkNavBarProps}
      />
      <Scene
        key='FAQ'
        component={FAQScreen}
        direction='horizontal'
        onLeft={() => NavActions.pop()}
        title='FAQ'
        {...darkNavBarProps}
      />
      <Scene
        key='privacy'
        component={PrivacyScreen}
        direction='horizontal'
        onLeft={() => NavActions.pop()}
        title='Privacy Policy'
        {...darkNavBarProps}
      />
      <Scene
        key='resetPassword'
        component={ResetPasswordScreen}
        onLeft={() => NavActions.pop()}
        title='Reset Password'
      />
      <Scene
        key='story'
        component={StoryReadingScreen}
        direction='horizontal'
        onLeft={() => NavActions.pop()}
        duration={1}
        {...clearNavBarProps}
      />
      <Scene
        key='storyComments'
        component={StoryCommentsScreen}
        direction='horizontal'
        onLeft={() => NavActions.pop()}
        title='Comments'
        {...darkNavBarProps}
      />
      <Scene
        key='tabbar'
        {...tabBarProps}
      >
        <Scene
          key='myFeed'
          initial
          icon={TabIcon}
          component={MyFeedScreen}
          title='Feed'
          renderBackButton={() => null}
          hideNavBar={true}
        />
        <Scene
          key='explore'
          icon={TabIcon}
          hideNavBar={false}
        >
          <Scene
            key='explore_grid'
            initial
            component={ExploreScreen}
            {...darkNavBarProps}
            hideNavBar={true}
          />
          <Scene
            key='explore_categoryFeed'
            component={CategoryFeedScreen}
            onLeft={() => NavActions.pop()}
            title='Category Feed'
            hideNavBar={false}
            {...darkNavBarProps}
          />
        </Scene>
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
          title='Notifications'
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
        key='edit_profile'
        component={ProfileScreen}
        hideNavBar
        isEditing={true}
        direction='vertical'
      />
      <Scene
        key='createStoryFlow'
        direction='vertical'
        hideNavBar={true}
      >
        <Scene
          key='createStory_info'
          title='Create Story'
          component={StoryCreateScreen}
        />
        <Scene
          key='createStory_cover'
          component={StoryCoverScreen}
          panHandlers={null}
          direction="horizontal"
        />
        <Scene
          key='createStory_content'
          component={FullScreenEditor}
          panHandlers={null}
          direction='horizontal'
        />
        <Scene
          key='createStory_details'
          panHandlers={null}
          component={CreateStoryDetailScreen}
        />
        <Scene
          key='createStory_tags'
          panHandlers={null}
          component={TagScreen}
        />
      </Scene>
      <Scene
        key='readOnlyProfile'
        component={ReadOnlyProfileScreen}
        onLeft={() => NavActions.pop()}
      />
      <Scene
        key='guestExplore'
        component={ExploreScreen}
        onLeft={() => NavActions.pop()}
      />
      <Scene
        key='followersScreen'
        component={FollowersScreen}
        title='Followers'
        direction='horizontal'
        onLeft={() => NavActions.pop({direction: 'horizontal'})}
        {...darkNavBarProps}
      />
      <Scene
        key='mediaSelectorScreen'
        component={MediaSelectorScreen}
        direction='horizontal'
      />
      <Scene
        key='viewBioScreen'
        component={ViewBioScreen}
        direction='horizontal'
        hideNavBar={true}
      />
      </Scene>
)
