import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import UserActions, {getByBookmarks} from '../Shared/Redux/Entities/Users'
import StoryActions, {getByUser, getUserFetchStatus, getBookmarksFetchStatus} from '../Shared/Redux/Entities/Stories'
import MediaUploadActions from '../Shared/Redux/MediaUploadRedux'

import ProfileHeader from '../Components/ProfileHeader/ProfileHeader'
import TabBar from '../Components/TabBar'
import StoryList from '../Components/StoryList'
import Footer from '../Components/Footer'
import Overlay from '../Components/Overlay'

const tabBarTabs = ['STORIES', 'DRAFTS', 'BOOKMARKS']
const readOnlyTabBarTabs = ['STORIES']

const ContentWrapper = styled.div``

const StoryListWrapper = styled.div`
  margin: 50px 7% 0;
`

const ListWrapper = styled.div`
  position: relative;
`
const OpaqueCover = styled(Overlay)`
  &:after {
    background: rgba(256, 256, 256, .8);
  }
`


class Profile extends Component {
  static propTypes = {
    match: PropTypes.object,
    // mapStateToProps properties
    sessionUserId: PropTypes.string,
    profilesUser: PropTypes.object,
    users: PropTypes.object,
    stories: PropTypes.object,
    userStoriesFetchStatus: PropTypes.object,
    userStoriesById: PropTypes.arrayOf(PropTypes.string),
    draftsFetchStatus: PropTypes.object,
    draftsById: PropTypes.arrayOf(PropTypes.string),
    userBookmarksFetchStatus: PropTypes.object,
    userBookmarksById: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.bool,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.string),
    // mapDispatchToProps functions
    getStories: PropTypes.func,
    getDrafts: PropTypes.func,
    updateUser: PropTypes.func,
    getUser: PropTypes.func,
    deleteStory: PropTypes.func,
    loadBookmarks: PropTypes.func,
    loadUserFollowing: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    reroute: PropTypes.func,
    uploadMedia: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'STORIES'
    }
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab }, () => {
        this.getTabInfo(tab)
      })
    }
  }

  getTabInfo = (tab) => {
    switch (tab) {
      case 'DRAFTS':
        return this.props.getDrafts(this.props.profilesUser.id)
      case 'BOOKMARKS':
        return this.props.loadBookmarks(this.props.profilesUser.id)
      case 'STORIES':
      default:
        return this.props.getStories(this.props.profilesUser.id)
    }
  }

  componentWillMount() {
    const {loadUserFollowing, myFollowedUsers, sessionUserId} = this.props
    if (!myFollowedUsers) loadUserFollowing(sessionUserId)
  }

  componentDidMount() {
    const userId = this.props.match.params.userId
    this.props.getUser(userId)
    this.props.getStories(userId)
    this.props.loadBookmarks(userId)
  }

  getStoriesByIds(idList) {
    return idList.map(id => {
      return this.props.stories[id]
    })
  }

  getSelectedStories = () => {
    const {
      userStoriesFetchStatus, userStoriesById,
      draftsFetchStatus, draftsById,
      userBookmarksFetchStatus, userBookmarksById,
    } = this.props
    // will use fetchStatus to show loading/error
    switch(this.state.activeTab){
      case 'DRAFTS':
        return {
          fetchStatus: draftsFetchStatus,
          selectedStories: this.getStoriesByIds(draftsById),
        }
      case 'BOOKMARKS':
        return {
          fetchStatus: userBookmarksFetchStatus,
          selectedStories: this.getStoriesByIds(userBookmarksById),
        }
      case 'STORIES':
      default:
        return {
          fetchStatus: userStoriesFetchStatus,
          selectedStories: this.getStoriesByIds(userStoriesById),
        }
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
      match, profilesUser, sessionUserId,
      users, myFollowedUsers,
      updateUser, uploadMedia
    } = this.props
    if (!profilesUser) return null

    let path = match.path.split("/")
    const isEdit = path[path.length-1] === 'edit'
    const isContributor = profilesUser.role === 'contributor'
    const isUsersProfile = profilesUser.id === sessionUserId
    const isFollowing = _.includes(myFollowedUsers, profilesUser.id)
    const {selectedStories} = this.getSelectedStories()
    return (
      <ContentWrapper>
        <ProfileHeader
          user={profilesUser}
          isContributor={isContributor}
          isEdit={isEdit}
          isUsersProfile={isUsersProfile}
          isFollowing={isFollowing}
          followUser={this._followUser}
          unfollowUser={this._unfollowUser}
          toProfileView={this._toProfileReroute}
          updateUser={updateUser}
          uploadMedia={uploadMedia}
        />
        <ListWrapper>
          <TabBar
            tabs={isUsersProfile ? tabBarTabs : readOnlyTabBarTabs}
            activeTab={this.state.activeTab}
            onClickTab={this.onClickTab}
          />

          { selectedStories.length &&
          <StoryListWrapper>
            <StoryList
              stories={selectedStories}
              users={users}
            />
            <Footer />
          </StoryListWrapper>
          }
          {isEdit && <OpaqueCover/>}
        </ListWrapper>
      </ContentWrapper>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const userId = ownProps.match.params.userId
  let {stories, users} = state.entities
  const profilesUser =  users.entities[userId]
  const sessionUserId = state.session.userId
  const myFollowedUsersObject = users.userFollowingByUserIdAndId[sessionUserId]
  const myFollowedUsers = myFollowedUsersObject ? myFollowedUsersObject.byId : undefined

  return {
    sessionUserId,
    profilesUser,
    users: users.entities,
    stories: stories.entities,
    userStoriesFetchStatus: getUserFetchStatus(stories, userId),
    userStoriesById: getByUser(stories, userId),
    draftsFetchStatus: stories.drafts.fetchStatus,
    draftsById: stories.drafts.byId,
    userBookmarksFetchStatus: getBookmarksFetchStatus(stories, userId),
    userBookmarksById: getByBookmarks(users, userId),
    error: stories.error,
    myFollowedUsers,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    getDrafts: () => dispatch(StoryActions.loadDrafts()),
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
    getUser: (userId) => dispatch(UserActions.loadUser(userId)),
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId)),
    loadBookmarks: (userId) => dispatch(StoryActions.getBookmarks(userId)),
    loadUserFollowing: (userId) => dispatch(UserActions.loadUserFollowing(userId)),
    followUser: (sessionUserID, userIdToFollow) => dispatch(UserActions.followUser(sessionUserID, userIdToFollow)),
    unfollowUser: (sessionUserID, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserID, userIdToUnfollow)),
    reroute: (path) => dispatch(push(path)),
    uploadMedia: (userId, file, uploadType) => dispatch(MediaUploadActions.uploadRequest(userId, file, uploadType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
