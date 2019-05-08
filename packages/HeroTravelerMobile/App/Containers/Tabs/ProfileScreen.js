import _ from 'lodash'
import React from 'react'
import { NativeModules } from 'react-native'
import { connect } from 'react-redux'
import UserActions, {getByBookmarks} from '../../Shared/Redux/Entities/Users'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import StoryActions, {getByUser, getUserFetchStatus, getBookmarksFetchStatus} from '../../Shared/Redux/Entities/Stories'
import ProfileView, {TabTypes} from '../../Components/ProfileView'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import { getPendingDraftsIds } from '../../Shared/Lib/getPendingDrafts'

const VideoManager = NativeModules.VideoManager

class ProfileScreen extends React.Component {
  shouldComponentUpdate(nextProps) {
    const shouldUpdate = _.some([
      this.props.user !== nextProps.user,
      this.props.draftsById !== nextProps.draftsById,
      this.props.pendingDraftsIds !== nextProps.pendingDraftsIds,
      this.props.userStoriesById !== nextProps.userStoriesById,
      this.props.userStoriesFetchStatus !== nextProps.userStoriesFetchStatus,
      this.props.userBookmarksById !== nextProps.userBookmarksById,
      this.props.userBookmarksFetchStatus !== nextProps.userBookmarksFetchStatus,
      this.props.guideIds !== nextProps.guideIds,
      this.props.guidesFetchStatus !== nextProps.guidesFetchStatus,
    ])

    return shouldUpdate
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData = () => {
    this.props.getUser(this.props.user.id)
    this.props.getStories(this.props.user.id)
    this.props.loadBookmarks(this.props.user.id)
    this.props.getGuides(this.props.user.id)
    this.props.loadDrafts()
    this.props.getDeletedStories(this.props.user.id)
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.guideIds !== prevProps.guideIds
      || this.props.userStoriesById !== prevProps.userStoriesById
    ) {
      VideoManager.cleanDrafts([
        ...this.props.draftsById,
        ...this.props.pendingDraftsIds,
      ])
    }
  }

  _selectTab = (tab) => {
    switch (tab) {
      case TabTypes.stories:
        return this.props.getStories(this.props.user.id)
      case TabTypes.drafts:
        this.props.getDeletedStories(this.props.user.id)
        return this.props.loadDrafts()
      case TabTypes.bookmarks:
        return this.props.loadBookmarks(this.props.user.id)
    }
  }

  _isTempImage = () => {
    return this.props.isEditing && this.props.user.profile.tempCover
  }

  render () {
    const {
      user,
      draftsById,
      pendingDraftsIds,
      userStoriesById,
      userStoriesFetchStatus,
      accessToken,
      updateUser,
      userBookmarksById,
      userBookmarksFetchStatus,
      draftsFetchStatus,
      guideIds,
      guidesFetchStatus,
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
        pendingDraftsIds={pendingDraftsIds}
        bookmarks={userBookmarksById}
        guideIds={guideIds}
        onSelectTab={this._selectTab}
        editable={true}
        isEditing={this.props.isEditing}
        updateUser={updateUser}
        accessToken={accessToken}
        profileImage={this._isTempImage() ? getImageUrl(user.profile.tempCover, 'basic') : getImageUrl(user.profile.cover, 'basic')}
        fetchStatus={userStoriesFetchStatus}
        draftsFetchStatus={draftsFetchStatus}
        guidesFetchStatus={guidesFetchStatus}
        bookmarksFetchStatus={userBookmarksFetchStatus}
        hasTabbar={!this.props.isEditing}
        onRefresh={this.initializeData}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const {userId} = state.session
  let {stories, users, guides} = state.entities
  const accessToken = _.find(state.session.tokens, {type: 'access'})

  return {
    user: state.entities.users.entities[userId],
    accessToken: accessToken ? accessToken.value : null,
    userStoriesFetchStatus: getUserFetchStatus(stories, userId),
    userStoriesById: getByUser(stories, userId),
    draftsFetchStatus: {loaded: true},
    draftsById: stories.drafts.byId,
    pendingDraftsIds: getPendingDraftsIds(state.pendingUpdates),
    userBookmarksById: getByBookmarks(users, userId),
    userBookmarksFetchStatus: getBookmarksFetchStatus(stories, userId),
    guideIds: guides.guideIdsByUserId ? guides.guideIdsByUserId[userId] : [],
    guidesFetchStatus: guides.fetchStatus,
    error: stories.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
    getUser: (userId) => dispatch(UserActions.loadUser(userId)),
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId)),
    loadDrafts: () => dispatch(StoryActions.loadDrafts()),
    getDeletedStories: (userId) => dispatch(StoryActions.getDeletedStories(userId)),
    loadBookmarks: (userId) => dispatch(StoryActions.getBookmarks(userId)),
    getGuides: (userId) => dispatch(GuideActions.getUserGuides(userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
