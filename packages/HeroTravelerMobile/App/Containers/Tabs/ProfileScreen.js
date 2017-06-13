import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import UserActions, {getByBookmarks} from '../../Redux/Entities/Users'
import StoryActions, {getByUser, getUserFetchStatus, getBookmarksFetchStatus} from '../../Redux/Entities/Stories'
import ProfileView, {TabTypes} from '../../Components/ProfileView'
import getImageUrl from '../../Lib/getImageUrl'


class ProfileScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectTabIndex: 0
    }
  }

  componentDidMount() {
    this.props.getUser(this.props.user.id)
    this.props.getStories(this.props.user.id)
    this.props.loadBookmarks(this.props.user.id)
  }

  _touchEdit = (storyId) => {
    NavActions.createStoryFlow({type: 'reset', navigatedFromProfile: true})
    NavActions.createStory_cover({storyId, navigatedFromProfile: true})
  }

  _touchTrash = (storyId) => {
    this.props.deleteStory(this.props.user.id, storyId)
  }

  _selectTab = (tab) => {
    switch (tab) {
      case TabTypes.stories:
        return this.props.getStories(this.props.user.id)
      case TabTypes.drafts:
        return this.props.getDrafts(this.props.user.id)
      case TabTypes.bookmarks:
        return this.props.loadBookmarks(this.props.user.id)
    }
  }

  render () {
    const {
      user,
      draftsById,
      userStoriesById,
      userStoriesFetchStatus,
      accessToken,
      updateUser,
      userBookmarksById,
      userBookmarksFetchStatus,
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
        drafts={draftsById}
        bookmarks={userBookmarksById}
        onSelectTab={this._selectTab}
        editable={true}
        touchTrash={this._touchTrash}
        touchEdit={this._touchEdit}
        isEditing={this.props.isEditing}
        updateUser={updateUser}
        showLike={true}
        accessToken={accessToken}
        profileImage={getImageUrl(user.profile.cover)}
        fetchStatus={userStoriesFetchStatus}
        draftsFetchStatus={this.props.draftsFetchStatus}
        bookmarksFetchStatus={userBookmarksFetchStatus}
        hasTabbar={!this.props.isEditing}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const {userId} = state.session
  let {stories, users} = state.entities
  return {
    user: state.entities.users.entities[userId],
    accessToken: _.find(state.session.tokens, {type: 'access'}).value,
    userStoriesFetchStatus: getUserFetchStatus(stories, userId),
    userStoriesById: getByUser(stories, userId),
    draftsFetchStatus: stories.drafts.fetchStatus,
    draftsById: stories.drafts.byId,
    userBookmarksById: getByBookmarks(users, userId),
    userBookmarksFetchStatus: getBookmarksFetchStatus(stories, userId),
    error: stories.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    getDrafts: () => dispatch(StoryActions.loadDrafts()),
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
    getUser: (userId) => dispatch(UserActions.loadUser(userId)),
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId)),
    loadBookmarks: (userId) => dispatch(StoryActions.getBookmarks(userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
