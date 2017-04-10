import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Images, Colors} from '../../Themes'
import SessionActions, {hasAuthData} from '../../Redux/SessionRedux'
import StoryActions, {getByUser} from '../../Redux/Entities/Stories'
import ProfileView from '../../Components/ProfileView'
import styles from '../Styles/ProfileScreenStyles'


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
      <ProfileView
        user={user}
        avatar={avatar}
        stories={storiesAsArray}
        editable={true}
        profileImage={Images.profile}
        fetchStatus={storyFetchStatus}
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
    entities: stories,
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
