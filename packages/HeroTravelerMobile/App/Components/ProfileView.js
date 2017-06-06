import React from 'react'
import styles from './Styles/ProfileViewStyles'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

import { Colors } from '../Themes'
import Loader from './Loader'
import StoryList from './StoryList'
import ConnectedStoryPreview from '../Containers/ConnectedStoryPreview'
import formatCount from '../Lib/formatCount'
import getImageUrl from '../Lib/getImageUrl'
import Avatar from './Avatar'
import NavBar from '../Containers/CreateStory/NavBar'
import HeroAPI from '../Services/HeroAPI'
import pathAsFileObject from '../Lib/pathAsFileObject'
import TabIcon from './TabIcon'

// @TODO UserActions shouldn't be in a component
import UserActions from '../Redux/Entities/Users'
import isTooltipComplete, {Types as TooltipTypes} from '../Lib/firstTimeTooltips'
import Metrics from '../Themes/Metrics'

const api = HeroAPI.create()

export const TabTypes = {
  stories: 'TAB_STORIES',
  drafts: 'TAB_DRAFTS',
  bookmarks: 'TAB_BOOKMARKS',
}

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.tab, selected ? styles.tabSelected : null]}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

// @TOOO make this smaller
class ProfileView extends React.Component {

  static defaultProps = {
    selectedTab: TabTypes.stories,
    onPressFollow: () => {},
    onSelectTab: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: this.props.selectedTab,
      imageMenuOpen: false,
      file: null,
      bioText: props.user.bio || '',
      usernameText: props.user.username || 'Enter a username'
    }
  }

  componentDidMount() {
    api.setAuth(this.props.accessToken)
  }

  _handleUpdateAvatarPhoto = (data) => {
    api.uploadAvatarImage(this.props.user.id, pathAsFileObject(data))
    NavActions.pop()
  }

  _handleUpdateCoverPhoto = (data) => {
    api.uploadUserCoverImage(this.props.user.id, pathAsFileObject(data))
    NavActions.pop()
  }

  _onRight = () => {
    this.props.updateUser({bio: this.state.bioText, username: this.state.usernameText})
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

  renderStory = (storyId) => {
    return (
      <ConnectedStoryPreview
        forProfile={true}
        editable={this.props.editable}
        touchTrash={this.props.touchTrash}
        touchEdit={this.props.touchEdit}
        titleStyle={styles.storyTitleStyle}
        subtitleStyle={styles.subtitleStyle}
        allowVideoPlay={true}
        autoPlayVideo={false}
        showLike={this.props.showLike}
        key={storyId}
        height={this.props.hasTabbar ? 177 : 177 + Metrics.tabBarHeight}
        storyId={storyId}
        onPress={() => NavActions.story({storyId})}
        onPressLike={story => alert(`Story ${storyId} liked`)}
      />
    )
  }

  selectTab = (tab) => {
    this.setState({selectedTab: tab}, () => {
      this.props.onSelectTab(tab)
    })
  }

  _setText = (usernameText) => {
    this.setState({usernameText})
  }

  _selectAvatar = () => {
    NavActions.mediaSelectorScreen({
      mediaType: 'photo',
      title: 'Edit Avatar Image',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Next',
      onSelectMedia: this._handleUpdateAvatarPhoto
    })
  }

  _selectCover = () => {
    NavActions.mediaSelectorScreen({
      mediaType: 'photo',
      title: 'Edit Cover Image',
      leftTitle: 'Cancel',
      onLeft: () => NavActions.pop(),
      rightTitle: 'Next',
      onSelectMedia: this._handleUpdateCoverPhoto
    })
  }

  _navToSettings = () => {
    NavActions.settings({type: 'push'})
  }

  _navToEditProfile = () => {
    NavActions.edit_profile()
  }

  _navToViewBio = () => {
    NavActions.viewBioScreen({
      user: this.props.user
    })
  }

  _navToFollowers = () => {
    NavActions.followersScreen({
      title: 'Followers',
      followersType: 'followers',
      loadDataAction: UserActions.loadUserFollowers,
      userId: this.props.user.id
    })
  }

  _navToFollowing = () => {
    NavActions.followersScreen({
      title: 'Following',
      followersType: 'following',
      loadDataAction: UserActions.loadUserFollowing,
      userId: this.props.user.id
    })
  }

  render() {
    const { user, stories, drafts, editable, isEditing, profileImage } = this.props
    let fetchStatus

    switch (this.state.selectedTab) {
      case TabTypes.stories:
        fetchStatus = this.props.fetchStatus
        break
      case TabTypes.drafts:
        fetchStatus = this.props.draftsFetchStatus
        break
    }

    let cog
    let buttons
    let tabs
    let avatarCamera
    let name = (
      <View style={styles.nameWrapper}>
        <Text style={styles.titleText}>{user.username}</Text>
        <View style={styles.nameSeparator} />
        <Text style={styles.italicText}>{user.profile.fullName}</Text>
      </View>
    )

    let showTooltip = !isEditing && editable && !isTooltipComplete(
        TooltipTypes.PROFILE_NO_STORIES,
        user.introTooltips
      )

    /* If the isEditing flag === true then the component will display the user's edit profile view,
       editable === true shows the user's profile view,
       otherwise it will show the view that the user sees when looking at another user's profile
     */

    if(isEditing === true){
      cog = null;
      tabs = null;
      // buttons = null;
      name = (
        <View style={styles.nameWrapper}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           <TextInput
             placeholder={user.username}
             value={this.state.usernameText}
             autoCapitalize='none'
             style={styles.titleText}
             onChangeText={this._setText}
             maxLength={20}
             returnKeyType={'done'}
           />
          <Icon style={{paddingTop: 2}} name='pencil' size={12} color={Colors.snow} />
          </View>
        </View>
      )

      avatarCamera = (
        <View style={{position: 'relative'}}>
            <TouchableOpacity
              style={styles.addAvatarPhotoButton}
              onPress={this._selectAvatar}
            >
              <Icon name='camera' size={35} color={Colors.whiteAlphaPt80} style={styles.updateAvatorIcon} />
          </TouchableOpacity>
        </View>
      )

      buttons = (
        <TouchableOpacity
          style={styles.addCoverPhotoButton}
          onPress={this._selectCover}
        >
          <Icon name='camera' size={35} color={Colors.whiteAlphaPt80} style={styles.cameraIcon} />
          <Text style={{color: Colors.snow}}>EDIT COVER IMAGE</Text>
        </TouchableOpacity>
      )


    } else if (editable === true) {
      cog = (
        <TouchableOpacity style={styles.settingsCog} onPress={this._navToSettings}>
          <TabIcon
            name='gear'
            style={{
              image: {
                height: 23,
                width: 23,
                tintColor: 'white',
              }
            }}></TabIcon>
        </TouchableOpacity>
      )

      buttons = (
        <TouchableOpacity
          style={styles.buttons}
          onPress={this._navToEditProfile}>
          <Text style={styles.buttonsText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      )

      tabs = (
        <View style={styles.tabnavEdit}>
          <Tab
            selected={TabTypes.stories === this.state.selectedTab}
            onPress={() => this.selectTab(TabTypes.stories)}
            text='STORIES' />
          <Tab
            selected={TabTypes.drafts === this.state.selectedTab}
            onPress={() => this.selectTab(TabTypes.drafts)}
            text='DRAFTS' />
          <Tab
            selected={TabTypes.bookmarks === this.state.selectedTab}
            text='BOOKMARKS' />
        </View>
      )

      avatarCamera = null;

    } else {
      cog = null

      buttons = (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={[
              styles.buttons,
              styles.followButton,
              this.props.isFollowing && styles.isFollowed
            ]}
            onPress={this.props.isFollowing ? this.props.onPressUnfollow : this.props.onPressFollow}>
            <Text style={styles.buttonsText}>{this.props.isFollowing ? 'FOLLOWING' : '+ FOLLOW'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons, styles.messageButton]}>
            <Text style={styles.buttonsText}>MESSAGE</Text>
          </TouchableOpacity>
        </View>
      )

      tabs = (
        <View style={styles.tabnavEdit}>
          <Tab selected={false} text='STORIES' />
        </View>
      )
      avatarCamera = null;
    }

    const gradientStyle = profileImage ? ['rgba(0,0,0,.6)', 'transparent', 'rgba(0,0,0,.6)'] : ['transparent', 'rgba(0,0,0,.6)']
    return (
      <View style={{flex: 1}}>
        {isEditing &&
          <NavBar
            title='Edit Profile'
            leftTitle='Cancel'
            onLeft={NavActions.pop}
            rightTitle='Save'
            onRight={this._onRight}
          />
        }
        <KeyboardAwareScrollView getTextInputRefs={() => [this.bioInput]} style={[
          this.props.hasTabbar ? styles.containerWithTabbar : null,
          styles.root,
          this.props.style,
        ]}>
        <View style={styles.gradientWrapper}>
          <Image
            style={[styles.coverImage, profileImage ? null : styles.noCoverImage]}
            resizeMode='cover'
            source={{uri: profileImage || undefined}}
          >
            <LinearGradient colors={gradientStyle} style={styles.gradient}>
              <View style={styles.coverInner}>
                {cog}
                {name}
              <View >
                <Avatar style={{alignItems: 'center', marginTop: 20 }} size='medium' avatarUrl={getImageUrl(user.profile.avatar)} />
                {avatarCamera}
              </View>
              {!isEditing &&
               <TouchableOpacity onPress={this._navToViewBio}>
                  <Text style={styles.italicText}>Read Bio</Text>
                </TouchableOpacity>
              }
              {!isEditing &&
                <View style={styles.followersWrapper}>
                  <View style={styles.firstFollowerColumn}>
                    <TouchableOpacity
                      onPress={this._navToFollowers}
                      style={[styles.followersColumn]}>
                      <Text style={styles.followerNumber}>{formatCount(user.counts.followers)}</Text>
                      <Text style={styles.followerLabel}>Followers</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={this._navToFollowing}
                    style={styles.followersColumn}>
                    <Text style={styles.followerNumber}>{formatCount(user.counts.following)}</Text>
                    <Text style={styles.followerLabel}>Following</Text>
                  </TouchableOpacity>
                </View>
              }
                {buttons}
              </View>
              {!isEditing && false &&
                <Text style={styles.contributor}>
                  <Icon name='star' color={Colors.red} size={15} style={styles.contributorIcon} />
                  <Text style={styles.contributorText}>&nbsp;&nbsp;&nbsp;CONTRIBUTOR</Text>
                </Text>
              }
            </LinearGradient>
          </Image>
          {isEditing &&
           <View style={{margin: Metrics.section}}>
             <Text style={{fontWeight: '900', fontSize: 16, marginVertical: Metrics.baseMargin}}>Edit Bio</Text>
             <TextInput
               ref={c => this.bioInput = c}
               style={{height: 150, fontSize: 16, color: '#757575'}}
               multiline={true}
               editable={true}
               onChangeText={(text) => this.setState({bioText: text})}
               value={this.state.bioText}
               maxLength={500}
               placeholder={'Tell us about yourself!'}
             />
           </View>
          }
          {!isEditing && <View style={styles.tabs}>
            {tabs}
            {this.state.selectedTab === TabTypes.stories && stories.length > 0 &&
              <StoryList
                storiesById={stories}
                refreshing={false}
                renderStory={this.renderStory}
              />
            }
            {this.state.selectedTab === TabTypes.drafts && drafts.length > 0 &&
              <StoryList
                storiesById={drafts}
                refreshing={false}
                renderStory={this.renderStory}
              />
            }
            {this.state.selectedTab === TabTypes.stories && fetchStatus.loaded && stories.length === 0 &&
              <View style={styles.noStories}>
                <Text style={styles.noStoriesText}>{this.props.editable ? showTooltip ? '' : 'There are no stories here' : 'This user has no stories published'}</Text>
              </View>
            }
            {this.state.selectedTab === TabTypes.drafts && fetchStatus.loaded && drafts.length === 0 &&
              <View style={styles.noStories}>
                <Text style={styles.noStoriesText}>{this.props.editable ? showTooltip ? '' : 'There are no stories here' : 'This user has no stories published'}</Text>
              </View>
            }
            {!fetchStatus.loaded && fetchStatus.fetching &&
              <View style={styles.spinnerWrapper}>
                <Loader
                  style={styles.spinner}
                  spinnerColor={Colors.background} />
              </View>
            }
          </View>
        }
        </View>
        </KeyboardAwareScrollView>
        {showTooltip && this.renderTooltip()}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)

