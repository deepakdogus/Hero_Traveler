import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Images, Colors} from '../../Themes'
import SessionActions, {hasAuthData} from '../../Redux/SessionRedux'
import UserActions from '../../Redux/Entities/Users'
import StoryActions, {getByUser, getUserFetchStatus} from '../../Redux/Entities/Stories'
import ProfileView from '../../Components/ProfileView'
import getImageUrl from '../../Lib/getImageUrl'
import styles from '../Styles/ProfileScreenStyles'


class ProfileScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectTabIndex: 0
    }
  }

  componentDidMount() {
    this.props.attemptRefreshUser(this.props.user.id)
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
    // this.props.loadBookmarks()
    this.setState({selectTabIndex: 2})
  }

  render () {
    const {
      user,
      stories,
      userStoriesById,
      userStoriesFetchStatus,
      accessToken,
      saveUser,
    } = this.props

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
        saveUser={saveUser}
        showLike={false}
        accessToken={accessToken}
        profileImage={getImageUrl(user.profile.cover)}
        fetchStatus={userStoriesFetchStatus}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const {userId} = state.session
  let {stories} = state.entities
  return {
    user: state.entities.users.entities[userId],
    accessToken: _.find(state.session.tokens, {type: 'access'}).value,
    userStoriesFetchStatus: getUserFetchStatus(stories, userId),
    userStoriesById: getByUser(stories, userId),
    // userBookmarksFetchStatus: {fetching: false, loaded: true}
    // // @TODO: draftFetchStatus
    // draftFetchStatus: {fetching: false, loaded: true},
    error: stories.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    updateBio: (bioText) => dispatch(UserActions.updateUser({bio: bioText})),
    updateUsername: (usernameText) => dispatch(UserActions.updateUser({username: usernameText})),
    attemptRefreshUser: (userId) => dispatch(UserActions.loadUser(userId)),
    // loadDrafts: () => dispatch(StoryActions.getDrafts()),
    // @TODO fixme: .getBookmarks() not implemented?
    // loadBookmarks: () => dispatch(StoryActions.getBookmarks()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
