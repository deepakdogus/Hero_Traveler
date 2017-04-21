import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Images, Colors} from '../../Themes'
import SessionActions, {hasAuthData} from '../../Redux/SessionRedux'
import StoryActions, {getByUser} from '../../Redux/Entities/Stories'
import ProfileView from '../../Components/ProfileView'
import getImageUrl from '../../Lib/getImageUrl'
import styles from '../Styles/ProfileScreenStyles'


class ProfileScreen extends React.Component {

  constructor(props) {
    super(props)

    console.log("this.props.isEditing in ProfileScreen: ", this.props.isEditing)

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

    // Deals with the case that the user logs out
    // and this page is still mounted and rendering

    if (!user) {
      return null
    }

    return (
      <ProfileView
        user={user}
        stories={userStoriesById}
        editable={true}
        isEditing={this.props.isEditing}
        profileImage={getImageUrl(user.profile.cover)}
        fetchStatus={userStoriesFetchStatus}
      />
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
    error
  } = state.entities.stories
  return {
    user: state.session.user,
    userStoriesFetchStatus,
    // @TODO: bookmarkFetchStatus
    userBookmarksFetchStatus,
    myBookmarksById,
    // @TODO: draftFetchStatus
    draftFetchStatus: {fetching: false, loaded: true},
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
