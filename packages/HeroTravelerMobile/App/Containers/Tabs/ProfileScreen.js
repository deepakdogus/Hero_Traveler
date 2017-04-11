import _ from 'lodash'
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

import formatCount from '../../Lib/formatCount'
import {Images, Colors} from '../../Themes'
import SessionActions, {hasAuthData} from '../../Redux/SessionRedux'
import Loader from '../../Components/Loader'
import Avatar from '../../Components/Avatar'
import StoryActions, {getByUser} from '../../Redux/Entities/Stories'
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

  constructor(props) {
    super(props)
    this.state = {
      selectTabIndex: 0
    }
  }

  componentDidMount() {
    this.props.attemptRefreshUser()
    this.props.attemptGetUserStories(this.props.user.id)
  }

  _storiesTab = () => {
    this.setState({selectTabIndex: 0})
  }

  _draftsTab = () => {
    // this.props.loadDrafts()
    this.setState({selectTabIndex: 1})
  }

  _bookmarksTab = () => {
    this.props.loadBookmarks()
    this.setState({selectTabIndex: 2})
  }

  render () {
    const {
      user,
      stories,
      userStoriesById,
      userStoriesFetchStatus,
      draftFetchStatus,
      userBookmarksFetchStatus,
      myBookmarksById
    } = this.props

    const draftsAsArray = []
    const bookmarksAsArray = _.map(myBookmarksById, storyId => {
      return {
        ...stories[storyId],
        author: this.props.user
      }
    })
    const storiesAsArray = _.map(userStoriesById, storyId => {
      return {
        ...stories[storyId],
        author: this.props.user
      }
    })

    // Deals with the case that the user logs out
    // and this page is still mounted and rendering
    if (!user) {
      return null
    }

    return (
      <ScrollView style={[styles.containerWithTabbar, styles.root]}>
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
              <Avatar
                avatarUrl={user.profile.avatar}
                size='large'
                iconColor={Colors.snow}
              />
              <TouchableOpacity onPress={() => alert('read bio')}>
                <Text style={styles.italicText}>Read Bio</Text>
              </TouchableOpacity>
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
            <Tab
              selected={this.state.selectTabIndex === 0}
              onPress={() => this._storiesTab()}
              text='STORIES'
            />
            <Tab
              selected={this.state.selectTabIndex === 1}
              onPress={() => this._draftsTab()}
              text='DRAFT'
            />
            <Tab
              selected={this.state.selectTabIndex === 2}
              onPress={() => this._bookmarksTab()}
              text='BOOKMARKS'
            />
          </View>
          {this.state.selectTabIndex === 0 && <View style={styles.tabWrapper}>
            {storiesAsArray.length > 0 &&
              <StoryList
                stories={storiesAsArray}
                height={200}
                titleStyle={styles.storyTitleStyle}
                subtitleStyle={styles.subtitleStyle}
                forProfile={true}
                refreshing={false}
                onPressStory={story => NavActions.story({storyId: story.id})}
                onPressLike={story => alert(`Story ${story.id} liked`)}
              />
            }
            {userStoriesFetchStatus.loaded && storiesAsArray.length === 0 &&
              <View style={styles.noStories}>
                <Text style={styles.noStoriesText}>You have no stories published</Text>
              </View>
            }
            {!userStoriesFetchStatus.loaded && userStoriesFetchStatus.fetching &&
              <View style={styles.spinnerWrapper}>
                <Loader
                  style={styles.spinner}
                  spinnerColor={Colors.background} />
              </View>
            }
          </View>
          }

          {this.state.selectTabIndex === 1 && <View style={styles.tabWrapper}>
            {draftsAsArray.length > 0 &&
              <StoryList
                stories={draftsAsArray}
                height={200}
                titleStyle={styles.storyTitleStyle}
                subtitleStyle={styles.subtitleStyle}
                forProfile={true}
                onPressStory={story => alert(`Story ${story.id} pressed`)}
                onPressLike={story => alert(`Story ${story.id} liked`)}
              />
            }
            {draftFetchStatus.loaded && draftsAsArray.length === 0 &&
              <View style={styles.noStories}>
                <Text style={styles.noStoriesText}>You have no drafts</Text>
              </View>
            }
            {!draftFetchStatus.loaded && draftFetchStatus.fetching &&
              <View style={styles.spinnerWrapper}>
                <Loader
                  style={styles.spinner}
                  spinnerColor={Colors.background} />
              </View>
            }
          </View>
          }

          {this.state.selectTabIndex === 2 && <View style={styles.tabWrapper}>
            {bookmarksAsArray.length > 0 &&
              <StoryList
                stories={bookmarksAsArray}
                height={200}
                titleStyle={styles.storyTitleStyle}
                subtitleStyle={styles.subtitleStyle}
                forProfile={true}
                onPressStory={story => alert(`Story ${story.id} pressed`)}
                onPressLike={story => alert(`Story ${story.id} liked`)}
              />
            }
            {userBookmarksFetchStatus.loaded && bookmarksAsArray.length === 0 &&
              <View style={styles.noStories}>
                <Text style={styles.noStoriesText}>You have no bookmarks</Text>
              </View>
            }
            {!userBookmarksFetchStatus.loaded && userBookmarksFetchStatus.fetching &&
              <View style={styles.spinnerWrapper}>
                <Loader
                  style={styles.spinner}
                  spinnerColor={Colors.background} />
              </View>
            }
          </View>
          }
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  const {user} = state.session
  const userId = user ? user.id : null
  let {
    userStoriesFetchStatus,
    userStoriesById,
    userBookmarksFetchStatus,
    myBookmarksById,
    entities: stories,
    error
  } = state.entities.stories;
  return {
    user: state.session.user,
    userStoriesFetchStatus,
    // @TODO: bookmarkFetchStatus
    userBookmarksFetchStatus,
    myBookmarksById,
    // @TODO: draftFetchStatus
    draftFetchStatus: {fetching: false, loaded: true},
    stories: stories,
    userStoriesById,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (tokens) => dispatch(SessionActions.logout(tokens)),
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    attemptRefreshUser: (userId) => dispatch(SessionActions.refreshUser(userId)),
    loadDrafts: () => dispatch(StoryActions.getDrafts()),
    loadBookmarks: () => dispatch(StoryActions.getBookmarks()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
