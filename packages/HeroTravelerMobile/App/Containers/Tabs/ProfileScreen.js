import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavActions,
  ActionConst as NavActionConst
} from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Images, Colors} from '../../Themes'
import SessionActions, {hasAuthData} from '../../Redux/SessionRedux'
import RoundedButton from '../../Components/RoundedButton'
import StoryActions from '../../Redux/StoryRedux.js'
import StoryList from '../../Components/StoryList'
import styles from '../Styles/ProfileScreenStyles'

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

class ProfileScreen extends React.Component {

  componentDidMount() {
    this.props.attemptRefreshUser()
    this.props.attemptGetUserStories(this.props.user._id)
  }

  render () {
    const {user} = this.props
    let avatar

    // Deals with the case that the user logs out
    // and this page is still mounted and rendering
    if (!user) {
      return null
    }

    if (user.profile.avatar) {
      avatar = (
        <Image
          style={styles.avatarImage}
          source={{uri: user.profile.avatar}}
        />
      )
    } else {
      avatar = (
        <Icon name="user-circle-o" color={Colors.snow} size={40} />
      )
    }

    return (
      <ScrollView style={[styles.containerWithTabbar]}>
        <Image
          style={styles.coverImage}
          source={Images.profile}
        >
          <LinearGradient colors={['rgba(0,0,0,.6)', 'transparent', 'rgba(0,0,0,.6)']} style={styles.gradient}>
            <View style={styles.coverInner}>
              <TouchableOpacity style={styles.settingsCog} onPress={() => NavActions.settings({type: 'push'})}>
                <Icon name='cog' size={25} color={Colors.snow} />
              </TouchableOpacity>
              <View style={styles.nameWrapper}>
                <Text style={styles.titleText}>{user.username}</Text>
                <View style={styles.nameSeparator} />
                <Text style={styles.italicText}>{user.profile.fullName}</Text>
              </View>
              {avatar}
              <TouchableOpacity onPress={() => alert('read bio')}>
                <Text style={styles.italicText}>Read Bio</Text>
              </TouchableOpacity>
              <View style={styles.followersWrapper}>
                <View style={styles.firstFollowerColumn}>
                  <TouchableOpacity
                    onPress={() => alert('list followers')}
                    style={[styles.followersColumn]}>
                    <Text style={styles.followerNumber}>{user.counts.followers}</Text>
                    <Text style={styles.followerLabel}>Followers</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => alert('list following')}
                  style={styles.followersColumn}>
                  <Text style={styles.followerNumber}>{user.counts.following}</Text>
                  <Text style={styles.followerLabel}>Following</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.editProfile}
                onPress={() => alert('edit profile')}>
                <Text style={styles.editProfileText}>EDIT PROFILE</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.contributor}>
              <Icon name='star' color={Colors.red} size={15} style={styles.contributorIcon} />
              <Text style={styles.contributorText}>&nbsp;&nbsp;&nbsp;CONTRIBUTOR</Text>
            </Text>
          </LinearGradient>
        </Image>
        <View style={styles.tabs}>
          <View style={styles.tabnav}>
            <Tab selected={true} onPress={() => alert('stories')} text='STORIES' />
            <Tab onPress={() => alert('drafts')} text='DRAFT' />
            <Tab onPress={() => alert('bookmarks')} text='BOOKMARKS' />
          </View>
          {this.props.posts && this.props.posts.length > 0 &&
            <StoryList
              stories={this.props.posts}
              height={200}
              titleStyle={styles.storyTitleStyle}
              subtitleStyle={styles.subtitleStyle}
              forProfile={true}
              onPressStory={story => alert(`Story ${story._id} pressed`)}
              onPressLike={story => alert(`Story ${story._id} liked`)}
            />
          }
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  let { fetching, posts, error } = state.feed;
  return {
    user: state.session.user,
    isLoggedIn: hasAuthData(state.session),
    apiTokens: state.session.tokens,
    fetching,
    posts,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (tokens) => dispatch(SessionActions.logout(tokens)),
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    attemptRefreshUser: (userId) => dispatch(SessionActions.refreshUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
