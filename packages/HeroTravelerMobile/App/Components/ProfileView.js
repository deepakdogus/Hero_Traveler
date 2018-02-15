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

// @TODO UserActions shouldn't be in a component
import UserActions from '../Shared/Redux/Entities/Users'
import isTooltipComplete, {Types as TooltipTypes} from '../Shared/Lib/firstTimeTooltips'

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
    this.props.updateUser({
      bio: this.state.bioText,
      username: this.state.usernameText,
      about: this.state.aboutText,
    })
    NavActions.pop()
  }

  _onLeft = () => {
    // currently tempCover and tempAvatar are actually directly saved to DB - so we need to revert
    const profileReverts = {}
    if (this.props.user.profile.tempCover) profileReverts.cover = this.props.user.profile.cover.id
    if (this.props.user.profile.tempAvatar) profileReverts.avatar = this.props.user.profile.avatar.id
    if (Object.keys(profileReverts).length) {
      this.props.updateUser({profile: profileReverts})
    }
    this.props.updateUserSuccess({
      id: this.props.user.id,
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

  renderTooltip() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 470,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={this._completeTooltip}
      >
          <View style={{
            height: 80,
            width: 300,
            padding: 10,
            borderRadius: 5,
            backgroundColor: 'white',
            alignItems: 'center',
            shadowColor: 'black',
            shadowOpacity: .2,
            shadowRadius: 30
          }}>
            <Text style={{marginTop: 10, textAlign: 'center'}}>Looks like you don't have any stories.{"\n"}  Publish your first story now!</Text>
          </View>
          <View style={{
            height: 0,
            width: 0,
            borderLeftWidth: 7,
            borderLeftColor: 'transparent',
            borderRightWidth: 7,
            borderRightColor: 'transparent',
            borderTopWidth: 10,
            borderTopColor: 'white',
          }}>
          </View>
      </TouchableOpacity>
    )
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
      <View style={{flex: 1}}>
        {isEditing &&
          <NavBar
            title='Edit Profile'
            leftTitle='Cancel'
            onLeft={this._onLeft}
            rightTitle='Save'
            onRight={this._onRight}
            style={{paddingTop: 15}}
          />
        }
        <ScrollView style={[
          this.props.hasTabbar ? styles.containerWithTabbar : null,
          styles.root,
          this.props.style,
        ]}>
        <View style={styles.gradientWrapper}>
          {isEditing &&
            <View style={{flex: 1}}>
              {this.renderProfileInfo()}
              <View style={styles.bioWrapper}>
                <Text style={styles.editBio}>Bio</Text>
                <TextInput
                  ref={this._bioRef}
                  style={[styles.bioText, styles.editBioText]}
                  multiline={true}
                  editable={true}
                  onChangeText={this._setBioText}
                  value={this.state.bioText}
                  maxLength={500}
                  placeholder={'Tell us about yourself!'}
                />
              </View>
            </View>
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
              showLike={this.props.showLike}
              user={this.props.user}
              showTooltip={showTooltip}
              location={location}
              error={this.getProfileTabsAndStoriesError()}
            />
          }
        </View>
        </ScrollView>
        {this.state.error &&
          <ShadowButton
            style={styles.errorButton}
            onPress={this._clearError}
            text={this.state.error}
          />
        }
        {showTooltip && this.renderTooltip()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const userId = state.session.userId
  return {
    location: state.routes.scene.name,
    error: state.entities.users.error,
    bookmarksError: state.entities.stories.bookmarks[userId].fetchStatus.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips})),
    updateUserSuccess: (user) => dispatch(UserActions.updateUserSuccess(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)

