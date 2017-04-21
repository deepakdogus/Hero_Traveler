import React from 'react'
import styles from './Styles/ProfileViewStyles'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native'
import Editor from '../Components/Editor'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../Themes'
import Loader from './Loader'
import StoryList from './StoryList'
import formatCount from '../Lib/formatCount'
import Avatar from './Avatar'
import NavBar from '../Containers/CreateStory/NavBar'

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default class ProfileView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      imageMenuOpen: false,
      file: null,
    }
  }

  _toggleImageMenu = () => {
    this.setState({imageMenuOpen: !this.state.imageMenuOpen})
  }

  _onLeft = () => {
    Alert.alert(
      'Cancel Draft',
      'Do you want to save this draft?',
      [{
        text: 'Yes, save the draft',
        onPress: () => NavActions.pop()
      }, {
        text: 'No, remove it',
        onPress: () => {
          NavActions.pop()
        }
      }]
    )
  }

  _onRight = () => {
    alert('save edits')
    NavActions.pop()
  }

  render() {
    const { user, stories, fetchStatus, editable, isEditing, profileImage } = this.props
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

    /* If the editable flag === true then the component will display the user's edit profile view,
       otherwise it will show the view that the user sees when looking at other profiles
    */

    if(isEditing === true){
      cog = null;
      tabs = null;
      // buttons = null;
      name = (
        <View style={styles.nameWrapper}>
          <View style={{flexDirection: 'row'}}>
          <Text style={styles.titleText}>{user.username}</Text>
          <Icon style={{paddingTop: 7}} name='pencil' size={12} color={Colors.snow} />
          </View>
        </View>
      )

      avatarCamera = (
        <View style={{position: 'relative'}}>
            <TouchableOpacity
              style={styles.addAvatarPhotoButton}
              onPress={() => {
                NavActions.mediaSelectorScreen({
                  mediaType: 'photo',
                  title: 'Edit Avatar Image',
                  leftTitle: 'Cancel',
                  onLeft: () => NavActions.pop(),
                  rightTitle: 'Next',
                  onSelectMedia: this._handleSelectCoverPhoto
                })
              }}
            >
              <Icon name='camera' size={20} color='gray' style={styles.updateAvatorIcon} />
          </TouchableOpacity>
        </View>
      )

      buttons = (
        <TouchableOpacity
          style={styles.addCoverPhotoButton}
          onPress={() => {
            NavActions.mediaSelectorScreen({
              mediaType: 'photo',
              title: 'Edit Cover Image',
              leftTitle: 'Cancel',
              onLeft: () => NavActions.pop(),
              rightTitle: 'Next',
              onSelectMedia: this._handleSelectCoverPhoto
            })
          }}
        >
          <Icon name='camera' size={20} color='gray' style={styles.cameraIcon} />
          <Text style={{color: Colors.snow}}>EDIT COVER IMAGE</Text>
        </TouchableOpacity>
      )


    } else if (editable === true) {
      cog = (
        <TouchableOpacity style={styles.settingsCog} onPress={() => NavActions.settings({type: 'push'})}>
          <Icon name='cog' size={25} color={Colors.snow} />
        </TouchableOpacity>
      )

      buttons = (
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => NavActions.edit_profile()}>
          <Text style={styles.buttonsText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      )

      tabs = (
        <View style={styles.tabnavEdit}>
          <Tab selected={true} onPress={() => alert('stories')} text='STORIES' />
          <Tab onPress={() => alert('drafts')} text='DRAFT' />
          <Tab onPress={() => alert('bookmarks')} text='BOOKMARKS' />
        </View>
      )

      avatarCamera = null;

    } else {
      cog = null

      buttons = (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => alert('FOLLOWING')}>
            <Text style={styles.buttonsText}>FOLLOWING</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => alert('MESSAGE')}>
            <Text style={styles.buttonsText}>MESSAGE</Text>
          </TouchableOpacity>
        </View>
      )

      tabs = (
        <View style={styles.tabnavEdit}>
          <Tab selected={false} onPress={() => alert('stories')} text='STORIES' />
        </View>
      )

      avatarCamera = null;

    }

    console.log('stories', stories)
    return (
      <View>
        {isEditing &&
          <NavBar
            title='Edit Profile'
            leftTitle='Cancel'
            onLeft={this._onLeft}
            rightTitle='Next'
            onRight={this._onRight}
          />
        }
        <ScrollView style={[
          this.props.hasTabbar ? styles.containerWithTabbar : null,
          styles.root,
          this.props.style,
        ]}>
          <Image
            style={styles.coverImage}
            source={profileImage}
          >
            <LinearGradient colors={['rgba(0,0,0,.6)', 'transparent', 'rgba(0,0,0,.6)']} style={styles.gradient}>
              <View style={styles.coverInner}>
                {cog}
                {name}
              <View >
                <Avatar style={{alignItems: 'center', marginTop: 20 }} size='medium' avatarUrl={user.profile.avatar} />
                {avatarCamera}
              </View>
              {!isEditing &&
                <TouchableOpacity onPress={() => alert('read bio')}>
                  <Text style={styles.italicText}>Read Bio</Text>
                </TouchableOpacity>
              }
              {!isEditing &&
                <View style={styles.followersWrapper}>
                  <View style={styles.firstFollowerColumn}>
                    <TouchableOpacity
                      onPress={() => alert('list followers')}
                      style={[styles.followersColumn]}>
                      <Text style={styles.followerNumber}>{formatCount(user.counts.followers)}</Text>
                      <Text style={styles.followerLabel}>Followers</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => alert('list following')}
                    style={styles.followersColumn}>
                    <Text style={styles.followerNumber}>{formatCount(user.counts.following)}</Text>
                    <Text style={styles.followerLabel}>Following</Text>
                  </TouchableOpacity>
                </View>
              }
                {buttons}
              </View>
              {!isEditing &&
                <Text style={styles.contributor}>
                  <Icon name='star' color={Colors.red} size={15} style={styles.contributorIcon} />
                  <Text style={styles.contributorText}>&nbsp;&nbsp;&nbsp;CONTRIBUTOR</Text>
                </Text>
              }
            </LinearGradient>
          </Image>
          {isEditing &&
           <TextInput
             style={{height: 200}}
              autoFocus={true}
              multiline={true}
              editable={true}
              onChangeText={(text) => this.setState({text})}
             value={this.state.text}
             placeholder='Tell us about yourself!'
             maxLength={500}
            />
          }
          {!isEditing && <View style={styles.tabs}>
            {tabs}
            {stories.length > 0 &&
              <StoryList
                stories={stories}
                height={200}
                titleStyle={styles.storyTitleStyle}
                subtitleStyle={styles.subtitleStyle}
                editable={editable}
                forProfile={true}
                onPressStory={story => NavActions.story({storyId: story.id})}
                onPressLike={story => alert(`Story ${story.id} liked`)}
              />
            }
            {fetchStatus.loaded && stories.length === 0 &&
              <View style={styles.noStories}>
                <Text style={styles.noStoriesText}>You have no stories published</Text>
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
        </ScrollView>
      </View>
    )
  }
}
