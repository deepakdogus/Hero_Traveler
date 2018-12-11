import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import UserActions, {getByBookmarks} from '../Shared/Redux/Entities/Users'
import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import UXActions from '../Redux/UXRedux'
import GuideActions from '../Shared/Redux/Entities/Guides'
import StoryActions, {getByUser, getUserFetchStatus, getBookmarksFetchStatus} from '../Shared/Redux/Entities/Stories'
import MediaUploadActions from '../Shared/Redux/MediaUploadRedux'
import { runIfAuthed } from '../Lib/authHelpers'

import ContainerWithFeedList from './ContainerWithFeedList'
import ProfileHeader from '../Components/ProfileHeader/ProfileHeader'
import TabBar from '../Components/TabBar'
import FeedItemList from '../Components/FeedItemList'
import Footer from '../Components/Footer'

const tabBarTabs = ['STORIES', 'DRAFTS', 'BOOKMARKS', 'GUIDES']
const readOnlyTabBarTabs = ['STORIES', 'GUIDES']

const ContentWrapper = styled.div``

const FeedItemListWrapper = styled.div`
  margin: 50px 7% 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const ListWrapper = styled.div`
  position: relative;
`

class Profile extends ContainerWithFeedList {
  static propTypes = {
    match: PropTypes.object,
    // mapStateToProps properties
    profilesUser: PropTypes.object,
    userUpdating: PropTypes.bool,
    users: PropTypes.object,
    userStoriesFetchStatus: PropTypes.object,
    guidesFetchStatus: PropTypes.object,
    draftsFetchStatus: PropTypes.object,
    userBookmarksFetchStatus: PropTypes.object,
    error: PropTypes.bool,
    userError: PropTypes.object,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.string),
    // mapDispatchToProps functions
    updateUser: PropTypes.func,
    getUser: PropTypes.func,
    deleteStory: PropTypes.func,
    loadUserFollowing: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    reroute: PropTypes.func,
    uploadMedia: PropTypes.func,
    uploadImage: PropTypes.func,
    openGlobalModal: PropTypes.func,
  }

  componentWillMount() {
    const {
      loadUserFollowing,
      myFollowedUsers,
      sessionUserId,
      openGlobalModal,
      location,
    } = this.props
    if (!myFollowedUsers && sessionUserId) loadUserFollowing(sessionUserId)
    if (location.search && location.search.indexOf('?t=') !== -1) {
      setTimeout(() => {
        openGlobalModal('emailVerificationConfirmation', {
          path: location.pathname,
        })
      }, 1500)
    }
    if (location.search && location.search.indexOf('?pt=') !== -1) {
      setTimeout(() => {
        openGlobalModal('resetPasswordAttempt', {
          path: location.pathname,
          token: location.search.substring(4),
        })
      }, 1500)
    }
    if (location.search && location.search.indexOf('?at=') !== -1) {
      // 3 = 'at' length plus 1 for the equal char
      const activeTab = location.search
        .substring(location.search.indexOf('at') + 3)
        .split('&')[0]
        .toUpperCase()
      this.setState({ activeTab })
    }
  }

  componentDidMount() {
    const userId = this.props.match.params.userId
    this.props.getUser(userId)
    this.props.getStories(userId)
    if (this.props.sessionUserId === userId) {
      this.props.loadBookmarks(userId)
    }
  }

  _followUser = () => {
    this.props.followUser(this.props.sessionUserId, this.props.profilesUser.id)
  }

  _unfollowUser = () => {
    this.props.unfollowUser(this.props.sessionUserId, this.props.profilesUser.id)
  }

  _toProfileReroute = () => {
    this.props.reroute(`/profile/${this.props.profilesUser.id}/view`)
  }

  render() {
    const {
      match,
      profilesUser,
      sessionUserId,
      myFollowedUsers,
      userError,
      userUpdating,
      updateUser,
      removeAvatar,
      uploadImage,
      uploadMedia,
      openGlobalModal,
      pendingDrafts,
    } = this.props
    if (!profilesUser) return null

    let path = match.path.split('/')
    const isEdit = path[path.length - 1] === 'edit'
    const isUsersProfile = profilesUser.id === sessionUserId
    const isFollowing = _.includes(myFollowedUsers, profilesUser.id)

    let {selectedFeedItems} = this.getSelectedFeedItems()
    if (this.state.activeTab === 'DRAFTS') {
      selectedFeedItems = [...pendingDrafts ,...selectedFeedItems]
    }

    return (
      <ContentWrapper>
        <ProfileHeader
          user={profilesUser}
          error={userError}
          updating={userUpdating}
          isEdit={isEdit}
          isUsersProfile={isUsersProfile}
          isFollowing={isFollowing}
          followUser={this._followUser}
          unfollowUser={this._unfollowUser}
          toProfileView={this._toProfileReroute}
          updateUser={updateUser}
          removeAvatar={removeAvatar}
          uploadMedia={uploadMedia}
          openGlobalModal={openGlobalModal}
          uploadImage={uploadImage}
          sessionUserId={sessionUserId}
        />
        {!isEdit &&
          <ListWrapper>
            <TabBar
              tabs={isUsersProfile ? tabBarTabs : readOnlyTabBarTabs}
              activeTab={this.state.activeTab}
              onClickTab={this.onClickTab}
            />

            { (!!selectedFeedItems.length) &&
            <FeedItemListWrapper>
              <FeedItemList feedItems={selectedFeedItems} />
              <Footer />
            </FeedItemListWrapper>
            }
          </ListWrapper>
        }
      </ContentWrapper>
    )
  }
}

function getPendingDrafts(pendingUpdates) {
  return pendingUpdates.updateOrder.reduce((pendingDrafts, key) => {
    const story = pendingUpdates.pendingUpdates[key].story
    if (story.draft) pendingDrafts.push(story)
    return pendingDrafts
  }, [])
}

function mapStateToProps(state, ownProps) {
  const userId = ownProps.match.params.userId
  let {stories, users, guides} = state.entities
  const profilesUser = users.entities[userId]
  const sessionUserId = state.session.userId
  const myFollowedUsersObject = users.userFollowingByUserIdAndId[sessionUserId]
  const myFollowedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined

  return {
    sessionUserId,
    profilesUser,
    users: users.entities,
    stories: stories.entities,
    guides: guides.entities,
    userStoriesFetchStatus: getUserFetchStatus(stories, userId),
    storiesById: getByUser(stories, userId),
    guidesFetchStatus: guides.fetchStatus,
    guidesById: _.get(guides, `guideIdsByUserId[${userId}]`, []),
    draftsFetchStatus: stories.drafts.fetchStatus,
    draftsById: stories.drafts.byId,
    pendingDrafts: getPendingDrafts(state.pendingUpdates),
    userBookmarksFetchStatus: getBookmarksFetchStatus(stories, userId),
    userBookmarksById: getByBookmarks(users, userId),
    error: stories.error,
    userError: users.error,
    userUpdating: users.updating,
    myFollowedUsers,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const targetUserId = ownProps.match.params.userId

  return {
    getStories: () => dispatch(StoryActions.fromUserRequest(targetUserId)),
    getGuides: () => dispatch(GuideActions.getUserGuides(targetUserId)),
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
    getUser: (userId) => dispatch(UserActions.loadUser(userId)),
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId)),
    loadDrafts: () => dispatch(StoryActions.loadDrafts()),
    loadBookmarks: () => dispatch(StoryActions.getBookmarks(targetUserId)),
    loadUserFollowing: (userId) => dispatch(UserActions.loadUserFollowing(userId)),
    followUser: (sessionUserId, userIdToFollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.followUser, [sessionUserId, userIdToFollow])),
    unfollowUser: (sessionUserId, userIdToUnfollow) =>
      dispatch(runIfAuthed(sessionUserId, UserActions.unfollowUser, [sessionUserId, userIdToUnfollow])),
    reroute: (path) => dispatch(push(path)),
    uploadMedia: (userId, file, uploadType) => dispatch(MediaUploadActions.uploadRequest(userId, file, uploadType)),
    removeAvatar: (userId) => dispatch(UserActions.removeAvatar(userId)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
    uploadImage: (file, callback) => dispatch(StoryCreateActions.uploadImage(file, callback)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
