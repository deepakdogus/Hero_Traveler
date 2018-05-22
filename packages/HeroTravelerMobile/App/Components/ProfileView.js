import React from 'react'
import PropTypes from 'prop-types'
import styles from './Styles/ProfileViewStyles'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'

import NavBar from '../Containers/CreateStory/NavBar'
import HeroAPI from '../Shared/Services/HeroAPI'
import pathAsFileObject from '../Shared/Lib/pathAsFileObject'
import ProfileUserInfo from './ProfileUserInfo'
import ProfileTabsAndStories from './ProfileTabsAndStories'
import ShadowButton from './ShadowButton'
import Tooltip from './Tooltip'

// @TODO UserActions shouldn't be in a component
import UserActions from '../Shared/Redux/Entities/Users'
import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import isTooltipComplete, {Types as TooltipTypes} from '../Shared/Lib/firstTimeTooltips'
import Loader from '../Components/Loader'
import {Colors} from '../Shared/Themes'

const api = HeroAPI.create()

export const TabTypes = {
  stories: 'TAB_STORIES',
  drafts: 'TAB_DRAFTS',
  bookmarks: 'TAB_BOOKMARKS',
}

const usernameContansts = {
  maxLength: 20,
  minLength: 2,
}

// @TOOO make this smaller
class ProfileView extends React.Component {

  static defaultProps = {
    onPressFollow: () => {},
    onSelectTab: () => {},
    bookmarksFetchStatus: {},
    draftsFetchStatus: {},
    storiesFetchStatus: {}
  }

  static propTypes = {
    userId: PropTypes.string,
    location: PropTypes.string,
    error: PropTypes.object,
    refresh: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: TabTypes.stories,
      imageMenuOpen: false,
      file: null,
      bioText: props.user.bio || '',
      usernameText: props.user.username || 'Enter a username',
      aboutText: props.user.about || '',
    }
  }

  componentDidMount() {
    api.setAuth(this.props.accessToken)
  }

  componentWillReceiveProps(newProps) {
    if ((this.props.location !== newProps.location) && (this.state.selectedTab !== TabTypes.stories)) {
      this.setState({
        selectedTab: TabTypes.stories
      })
    }
    if (!this.hasCompletedNoStoriesTooltip() && newProps.stories.length){
      this._completeTooltip()
    }
  }
  _handleUpdateAvatarPhoto = (data) => {
    api.uploadAvatarImage(this.props.user.id, pathAsFileObject(data))
    .then(({ data }) => {
      // if there is a message it means there was an error
      if (data.message) {
        return Promise.reject(new Error(data.message))
      }
      else {
        this.props.updateUserSuccess({
          id: data.id,
          profile: {
            tempAvatar: data.profile.avatar,
          }
        })
      }
    })
    .then(() => {
      NavActions.pop()
    })
    .catch(() => {
      NavActions.pop()
      this.setState({error: 'There was an error updating your profile photo. Please try again'})
    })
  }

  _onRight = () => {
    if (this.state.usernameText.length <= 1) {
      this.setState({error: `Usernames must be between ${usernameContansts.minLength} and ${usernameContansts.maxLength} characters`})
      return
    }
    this._updateUser();
  }

  _updateUser = () => {
    this.props.updateUser({
      bio: this.state.bioText,
      username: this.state.usernameText,
      about: this.state.aboutText,
    })
    NavActions.pop()
  }

  _onLeft = () => {
    const {id, profile} = this.props.user

    // currently tempCover and tempAvatar are actually directly saved to DB - so we need to revert
    // need to add fullName so that we dont accidentally set it to undefined
    const profileReverts = {
      fullName: profile.fullName,
      cover: profile.cover,
      avatar: profile.avatar,
    }

    this.props.updateUser({
      profile: profileReverts,
    })

    this.props.updateUserSuccess({
      id,
      profile: {
        tempCover: undefined,
        tempAvatar: undefined,
      }
    })
    NavActions.pop()
  }

  _completeTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.PROFILE_NO_STORIES,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  selectTab = (tab) => {
    if (this.state.selectedTab !== tab) {
      this.setState({selectedTab: tab}, () => {
        this.props.onSelectTab(tab)
      })
    }
  }

  _setText = (usernameText) => this.setState({usernameText})
  _setAbout = (aboutText) => this.setState({aboutText})
  _setBioText = (bioText) => this.setState({bioText})
  _clearError = () => this.setState({error: null})

  _bioRef = c => this.bioInput = c

  getStoriesById() {
    const {drafts, bookmarks, stories} = this.props
    if (this.state.selectedTab === TabTypes.stories) return stories
    else if (this.state.selectedTab === TabTypes.drafts) return drafts
    else if (this.state.selectedTab === TabTypes.bookmarks) return bookmarks
  }

  getFetchStatus(){
    const {selectedTab} = this.state
    if (selectedTab === TabTypes.stories) return this.props.fetchStatus
    else if (selectedTab === TabTypes.drafts) return this.props.draftsFetchStatus
    else if (selectedTab === TabTypes.bookmarks) return this.props.bookmarksFetchStatus
  }

  renderProfileInfo = () => {
    const {
      user, editable, isEditing,
      isFollowing, onPressFollow, onPressUnfollow
    } = this.props
    return (
      <ProfileUserInfo
        user={user}
        editable={editable}
        isEditing={isEditing}
        isFollowing={isFollowing}
        onPressUnfollow={onPressUnfollow}
        onPressFollow={onPressFollow}
        usernameText={this.state.usernameText}
        setUsername={this._setText}
        aboutText={this.state.aboutText}
        setAbout={this._setAbout}
        handleUpdateAvatarPhoto={this._handleUpdateAvatarPhoto}
      />
    )
  }

  hasCompletedNoStoriesTooltip() {
    return isTooltipComplete(
      TooltipTypes.PROFILE_NO_STORIES,
      this.props.user.introTooltips
    )
  }

  getProfileTabsAndStoriesError(){
    const {selectedTab} = this.state
    const {error, bookmarksError} = this.props
    if (selectedTab === TabTypes.bookmarks) return bookmarksError || error
    else return error
  }

  render() {
    const {editable, isEditing, location, stories} = this.props

    let showTooltip = !isEditing && editable &&
      !stories.length && !this.hasCompletedNoStoriesTooltip()

    return (
      <View style={styles.flexOne}>
        {isEditing &&
          <NavBar
            title='Edit Profile'
            leftTitle='Cancel'
            onLeft={this._onLeft}
            rightTitle='Save'
            onRight={this._onRight}
            style={styles.navbarStyle}
          />
        }

        <View style={styles.gradientWrapper}>
          {isEditing &&
            <ScrollView style={styles.flexOne}>
              <View style={styles.flexOne}>
                {this.renderProfileInfo()}
                <View style={styles.bioWrapper}>
                  <Text style={styles.editBio}>Bio</Text>
                  <TextInput
                    ref={this._bioRef}
                    style={styles.bioText}
                    multiline
                    onChangeText={this._setBioText}
                    value={this.state.bioText}
                    maxLength={500}
                    returnKeyType={'done'}
                    placeholder='Tell us about yourself!'
                  />
                </View>
              </View>
            </ScrollView>
          }
          {!isEditing &&
            <ProfileTabsAndStories
              editable={editable}
              renderProfileInfo={this.renderProfileInfo}
              storiesById={this.getStoriesById()}
              fetchStatus={this.getFetchStatus()}
              tabTypes={TabTypes}
              selectTab={this.selectTab}
              selectedTab={this.state.selectedTab}
              user={this.props.user}
              sessionUserId={this.props.userId}
              showTooltip={showTooltip}
              location={location}
              error={this.getProfileTabsAndStoriesError()}
            />
          }
        </View>
        {this.state.error &&
          <ShadowButton
            style={styles.errorButton}
            onPress={this._clearError}
            text={this.state.error}
          />
        }
        {showTooltip &&
          <Tooltip
            position='bottom-center'
            text={"Looks like you don't have any stories.\nPublish your first story now!"}
            onDismiss={this._completeTooltip}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const userId = state.session.userId
  const hasBookmarks = !!state.entities.stories.bookmarks
  return {
    userId,
    location: state.routes.scene.name,
    error: state.entities.users.error,
    bookmarksError: hasBookmarks ? state.entities.stories.bookmarks[userId].fetchStatus.error : undefined,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips})),
    updateUserSuccess: (user) => dispatch(UserActions.updateUserSuccess(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)

