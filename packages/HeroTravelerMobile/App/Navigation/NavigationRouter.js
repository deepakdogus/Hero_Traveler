import React from 'react'
import {
  Scene,
  Actions as NavActions,
} from 'react-native-router-flux'
import _ from 'lodash'

import LaunchScreen from '../Containers/LaunchScreen'
import Styles from './Styles/NavigationContainerStyles'

// Tabs
import MyFeedScreen from '../Containers/Tabs/MyFeedScreen'
import ExploreScreen from '../Containers/Tabs/ExploreScreen'
import TabIcon from '../Components/TabIcon'
// Profile tab
import ProfileScreen from '../Containers/Tabs/ProfileScreen'
import ProfileEditScreen from '../Containers/ProfileEditScreen'
import ReadOnlyProfileScreen from '../Containers/ReadOnlyProfileScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import Settings_NotificationScreen from '../Containers/Settings_NotificationScreen'
import GridItemFeedScreen from '../Containers/Explore/GridItemFeedScreen'
import FollowersScreen from '../Containers/FollowersScreen'
import ViewBioScreen from '../Components/ViewBioScreen'
// import FollowingScreen from '../Containers/FollowingScreen'

// Info Screens
import TermsAndConditionsScreen from '../Containers/TermsAndConditionsScreen'
import FAQScreen from '../Containers/FAQScreen'
import PrivacyScreen from '../Components/PrivacyScreen'
import ChangePasswordScreen from '../Containers/ChangePasswordScreen'
import ChangeEmailScreen from '../Containers/ChangeEmailScreen'

// Story reading & creating
import StoryReadingScreen from '../Containers/StoryReadingScreen'
import CommentsScreen from '../Containers/CommentsScreen'
import StoryCreateScreen from '../Containers/CreateStory/1_CreateStoryScreen'
import CreateStoryDetailScreen from '../Containers/CreateStory/4_CreateStoryDetailScreen'
import TagScreen from '../Containers/CreateStory/TagScreen'
import TextInputScreen from '../Containers/CreateStory/TextInputScreen'
import LocationScreen from '../Containers/CreateStory/LocationScreen'
import MediaSelectorScreen from '../Containers/MediaSelectorScreen'
import AddButtonScreen from '../Containers/CreateStory/AddButtonScreen'

import ActivityScreen from '../Containers/Tabs/ActivityScreen'

// Signup & login
import LoginScreen from '../Containers/LoginScreen'
import ResetPasswordRequestScreen from '../Containers/ResetPasswordRequestScreen'
import ResetPasswordScreen from '../Containers/ResetPasswordScreen'
import SignupScreen from '../Containers/Signup/SignupScreen'
import SignupChangeUsername from '../Containers/Signup/SignupChangeUsername'
import SignupChangeEmail from '../Containers/Signup/SignupChangeEmail'
import SignupAdditionalInfo from '../Containers/Signup/SignupAdditionalInfo'
import SignupTopics from '../Containers/Signup/SignupTopics'
import SignupSocial from '../Containers/Signup/SignupSocial'
import NavButton from './NavButton'

// Guides
import AddStoryToGuides from '../Containers/Guides/AddStoryToGuides'
import CreateGuideScreen from '../Containers/Guides/CreateGuide'
import EditGuideStories from '../Containers/Guides/EditGuideStories'
import GuideReadingScreen from '../Containers/GuideReadingScreen'

// Search
import SearchResultsScreen from '../Containers/SearchResultsScreen'
import SearchResultsSeeAllScreen from '../Components/SearchResultsSeeAllScreen'

import { Images } from '../Shared/Themes'

const navBarProps = {
  navigationBarStyle: Styles.navBar,
  titleStyle: [Styles.navText, Styles.navTitle],
  backButtonTextStyle: Styles.buttonGreyText,
  leftButtonTextStyle: Styles.buttonGreyText,
  rightButtonTextStyle: Styles.navText,
  leftButtonIconStyle: Styles.navBarBack,
  rightButtonIconStyle: Styles.navBarBack,
}

const backButtonWithText = {
  leftButtonIconStyle: Styles.backButtonWithText,
}

const tabBarProps = {
  tabs: true,
  tabBarStyle: Styles.tabBar,
  tabBarIconContainerStyle: Styles.tabBarItemContainer,
}

// const launchNavButton = (props) => {
//   return (<NavButton
//     onRight={props.onRight}
//     text='Browse as a Guest'
//     iconName='arrowRight'
//     style={{
//       text: Styles.browseGuest,
//       icon: {
//         height: 14,
//         width: 7,
//         marginTop: 1.5,
//       }
//     }}/>)
// }

// const launchOnRight = () => __DEV__ ? NavActions.guestExplore() : alert('Browse as guest')

const topicsRightBtn = ({ onRight }) => (
  <NavButton
    onRight={onRight}
    text='Next'
    iconName='arrowRightRed'
  />
)

const socialRightBtn = ({ onRight }) => (
  <NavButton
    onRight={onRight}
    text='Done'
  />
)

const alwaysNull = () => null

const popVertical = () => NavActions.pop({direction: 'horizontal'})

const navToCreateFlow = () => {
  NavActions.createStoryFlow({
    type: 'reset',
    shouldLoadStory: true,
  })
}

const navToActivity = () => {
  NavActions.tabbar({type: 'reset'})
  NavActions.activity()
}

const navToMyFeed = () => {
  NavActions.tabbar({type: 'reset'})
  NavActions.myFeed()
}

export const navToProfile = () => {
  NavActions.tabbar({type: 'reset'})
  NavActions.profile()
}

const navToExplore = () => {
  NavActions.tabbar({type: 'reset'})
  NavActions.explore()
}

const navToSignupTopics = () => NavActions.signupFlow_topics()
const navtoSignupAdditionalInfo = () => NavActions.signupFlow_additionalInfo()
const navToSignupChangeEmail = () => NavActions.signupFlow_changeEmail()
const navToSignupSocial = () => NavActions.signupFlow_social()

const navToTabbar = () => NavActions.tabbar()
const noop = () => {}
/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

export default NavActions.create(
    <Scene
      key='root'
      {...navBarProps}
    >
        {/* Add this back when we have "Browse as a guest" functionality
            renderRightButton={launchNavButton}.
            onRight={launchOnRight}
        */}
      <Scene
        key='launchScreen'
        component={LaunchScreen}
        hideNavBar={false}
        hideBackImage={true}
      />
      <Scene
        key='signup'
        component={SignupScreen}
        backButtonImage={Images.iconArrowLeft}
        leftButtonIconStyle={Styles.buttonGrey}
      />
      <Scene
        key='signupFlow'
        {...navBarProps}
      >
        <Scene
          initial
          key='signupFlow_changeUsername'
          hideNavBar={true}
          component={SignupChangeUsername}
          onRight={navtoSignupAdditionalInfo}
          renderRightButton={socialRightBtn}
        />
        <Scene
          key='signupFlow_changeEmail'
          hideNavBar={true}
          component={SignupChangeEmail}
          onRight={navToSignupTopics}
          renderRightButton={socialRightBtn}
        />
        <Scene
          key='signupFlow_additionalInfo'
          hideNavBar={true}
          component={SignupAdditionalInfo}
          onRight={navToSignupChangeEmail}
          renderRightButton={socialRightBtn}
        />
        <Scene
          hideBackImage={true}
          hideNavBar={false}
          panHandlers={null}
          key='signupFlow_topics'
          component={SignupTopics}
          renderRightButton={topicsRightBtn}
          onRight={navToSignupSocial}
          onBack={noop}
        />
        <Scene
          key='signupFlow_social'
          hideNavBar={false}
          component={SignupSocial}
          renderRightButton={socialRightBtn}
          backTitle='Back'
          {..._.merge({}, navBarProps, backButtonWithText)}
          backButtonImage={Images.iconArrowLeft}
          backButtonTextStyle={Styles.buttonGreyText}
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
        title='CHANGE PASSWORD'
      />
      <Scene
        key='changeEmail'
        component={ChangeEmailScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='CHANGE EMAIL'
      />
      <Scene
        key='settings'
        component={SettingsScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='SETTINGS'
      />
      <Scene
        key='settings_notification'
        component={Settings_NotificationScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='NOTIFICATIONS'

      />
      <Scene
        key='terms'
        component={TermsAndConditionsScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title={'TERMS & CONDITIONS'}
      />
      <Scene
        key='FAQ'
        component={FAQScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        title='FAQ'
      />
      <Scene
        key='privacy'
        component={PrivacyScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        title='PRIVACY POLICY'
      />
      <Scene
        key='resetPassword'
        component={ResetPasswordScreen}
        onLeft={NavActions.pop}
        title='RESET PASSWORD'
      />
      <Scene
        key='story'
        component={StoryReadingScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        titleStyle={Styles.storyTitle}
      />
      <Scene
        key='guide'
        component={GuideReadingScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        titleStyle={Styles.storyTitle}
      />
      <Scene
        key='comments'
        component={CommentsScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconClose}
        title='COMMENTS'
      />
      <Scene
        key='tabbar'
        type='reset'
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
          onPress={navToMyFeed}
        />
        <Scene
          key='explore'
          icon={TabIcon}
          hideNavBar={false}
          onPress={navToExplore}
        >
          <Scene
            key='explore_grid'
            initial
            component={ExploreScreen}
            hideNavBar={true}
          />
          <Scene
            key='explore_categoryFeed'
            component={GridItemFeedScreen}
            onLeft={NavActions.pop}
            backButtonImage={Images.iconArrowLeft}
            hideNavBar={true}
          />
        </Scene>
        <Scene
          key='createStory'
          title='Create Story'
          icon={TabIcon}
          onPress={navToCreateFlow}
          style={Styles.createStory}
        />
        <Scene
          key='activity'
          icon={TabIcon}
          component={ActivityScreen}
          title='NOTIFICATIONS'
          {...navBarProps}
          onPress={navToActivity}
        />
        <Scene
          key='profile'
          icon={TabIcon}
          component={ProfileScreen}
          hideNavBar
          onPress={navToProfile}
        />
      </Scene>
      <Scene
        key='edit_profile'
        component={ProfileEditScreen}
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
          key='createStory_cover'
          component={StoryCreateScreen}
          panHandlers={null}
          direction="horizontal"
        />
        <Scene
          key='createStory_details'
          panHandlers={null}
          component={CreateStoryDetailScreen}
        />
        <Scene
          key='createStory_location'
          panHandlers={null}
          component={LocationScreen}
        />
        <Scene
          key='createStory_addButton'
          panHandlers={null}
          component={AddButtonScreen}
        />
      </Scene>
      <Scene
        key='readOnlyProfile'
        component={ReadOnlyProfileScreen}
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        navigationBarStyle={Styles.navBarFixedHeight}
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
        title='FOLLOWERS'
        direction='horizontal'
        onLeft={popVertical}
        backButtonImage={Images.iconArrowLeft}
      />
      <Scene
        key='mediaSelectorScreen'
        component={MediaSelectorScreen}
        direction='horizontal'
      />
      <Scene
        key='textInputScreen'
        component={TextInputScreen}
        direction='horizontal'
      />
      <Scene
        key='tagSelectorScreen'
        panHandlers={null}
        component={TagScreen}
      />
      <Scene
        key='locationSelectorScreen'
        panHandlers={null}
        component={LocationScreen}
      />
      <Scene
        key='viewBioScreen'
        component={ViewBioScreen}
        direction='horizontal'
        hideNavBar={true}
      />
      <Scene
        key='AddStoryToGuides'
        component={AddStoryToGuides}
        hideNavBar
      />
      <Scene
        key='createGuide'
        component={CreateGuideScreen}
        hideNavBar
      />
      <Scene
        key='editGuideStories'
        component={EditGuideStories}
        hideNavBar
      />
      <Scene
        key='searchResults'
        component={SearchResultsScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        titleStyle={Styles.storyTitle}
      />
      <Scene
        key='searchResultsSeeAll'
        component={SearchResultsSeeAllScreen}
        direction='horizontal'
        onLeft={NavActions.pop}
        backButtonImage={Images.iconArrowLeft}
        titleStyle={Styles.storyTitle}
      />
    </Scene>,
)
