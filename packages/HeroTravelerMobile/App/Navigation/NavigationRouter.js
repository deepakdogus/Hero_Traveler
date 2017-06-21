import React from 'react'
import {
  Scene,
  Actions as NavActions
} from 'react-native-router-flux'

import LaunchScreen from '../Containers/LaunchScreen'
import Styles from './Styles/NavigationContainerStyles'

// Tabs
import MyFeedScreen from '../Containers/Tabs/MyFeedScreen'
import ExploreScreen from '../Containers/Tabs/ExploreScreen'
import TabIcon from '../Components/TabIcon'
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
import NavButton from './NavButton'

import {Images} from '../Themes'

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

const launchNavButton = (props) => {
  return (<NavButton
    onRight={props.onRight}
    text='Browse as a Guest'
    iconName='arrowRight'
    style={{
      text: Styles.browseGuest,
      icon: {
        height: 14,
        width: 7,
        marginTop: 1.5,
      }
    }}/>)
}

const launchOnRight = () => __DEV__ ? NavActions.guestExplore() : alert('Browse as guest')

const topicsRightBtn = (props) => {
  return (<NavButton
    onRight={props.onRight}
    text='Next'
    iconName='arrowRightRed'/>)
}

const socialRightBtn = (props) => {
  return (<NavButton
    onRight={props.onRight}
    text='Done'
    iconName='arrowRightRed'/>)
}

const alwaysNull = () => null

const popVertical = () => NavActions.pop({direction: 'horizontal'})

const navToCreateFlow = () => NavActions.createStoryFlow()

const navToSignupSocial = () => NavActions.signupFlow_social()

const navToTabbar = () => NavActions.tabbar()

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
        renderRightButton={launchNavButton}
        onRight={launchOnRight}
        hideNavBar={false}
      />
      <Scene
        key='signup'
        component={SignupScreen}
        backButtonImage={Images.iconArrowLeft}
        leftButtonIconStyle={Styles.buttonGrey}
      />
      <Scene
        key='signupFlow'
        {...darkNavBarProps}
      >
        <Scene
          initial
          key='signupFlow_topics'
          component={SignupTopics}
          onRight={navToSignupSocial}
          renderRightButton={topicsRightBtn}
        />
        <Scene
          key='signupFlow_social'
          component={SignupSocial}
          renderRightButton={socialRightBtn}
          leftButtonIconStyle={Styles.buttonGrey}
          backTitle='Back'
          backButtonImage={Images.iconArrowLeft}
          onRight={navToTabbar}
        />
      </Scene>
      <Scene
        key='login'
        backButtonImage={Images.iconArrowLeft}
        leftButtonIconStyle={Styles.buttonGrey}
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
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='Change Password'
        {...darkNavBarProps}
      />
      <Scene
        key='settings'
        component={SettingsScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='Settings'
        {...darkNavBarProps}
      />
      <Scene
        key='settings_notification'
        component={Settings_NotificationScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='Notifications'
        {...darkNavBarProps}
      />
      <Scene
        key='terms'
        component={TermsAndConditionsScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='Terms & Conditions'
        {...darkNavBarProps}
      />
      <Scene
        key='FAQ'
        component={FAQScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='FAQ'
        {...darkNavBarProps}
      />
      <Scene
        key='privacy'
        component={PrivacyScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        title='Privacy Policy'
        {...darkNavBarProps}
      />
      <Scene
        key='resetPassword'
        component={ResetPasswordScreen}
        onLeft={NavActions.pop}
        title='Reset Password'
      />
      <Scene
        key='story'
        component={StoryReadingScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        {...clearNavBarProps}
      />
      <Scene
        key='storyComments'
        component={StoryCommentsScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconClose}
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
          renderBackButton={alwaysNull}
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
            onLeft={NavActions.pop}
            backButtonImage={Images.iconArrowLeft}
            title='Category Feed'
            hideNavBar={false}
            {...darkNavBarProps}
          />
        </Scene>
        <Scene
          key='createStory'
          title='Create Story'
          icon={TabIcon}
          onPress={navToCreateFlow}
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
        panHandlers={null}
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
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
      />
      <Scene
        key='guestExplore'
        component={ExploreScreen}
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
      />
      <Scene
        key='followersScreen'
        component={FollowersScreen}
        title='Followers'
        direction='horizontal'
        onLeft={popVertical}
        backButtonImage={Images.iconArrowLeft}
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
