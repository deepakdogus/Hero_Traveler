import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import UserActions, {getByBookmarks} from '../Shared/Redux/Entities/Users'
import GuideActions from '../Shared/Redux/Entities/Guides'
import StoryActions, {getByUser, getUserFetchStatus, getBookmarksFetchStatus} from '../Shared/Redux/Entities/Stories'
import MediaUploadActions from '../Shared/Redux/MediaUploadRedux'

import ProfileHeader from '../Components/ProfileHeader/ProfileHeader'
import TabBar from '../Components/TabBar'
import FeedItemList from '../Components/FeedItemList'
import Footer from '../Components/Footer'
import Overlay from '../Components/Overlay'

const tabBarTabs = ['STORIES', 'DRAFTS', 'BOOKMARKS', 'GUIDES']
const readOnlyTabBarTabs = ['STORIES', 'GUIDES']

const ContentWrapper = styled.div``

const FeedItemListWrapper = styled.div`
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
    userUpdating: PropTypes.bool,
    users: PropTypes.object,
    stories: PropTypes.object,
    userStoriesFetchStatus: PropTypes.object,
    userStoriesById: PropTypes.arrayOf(PropTypes.string),
    guidesFetchStatus: PropTypes.object,
    userGuidesById: PropTypes.arrayOf(PropTypes.string),
    draftsFetchStatus: PropTypes.object,
    draftsById: PropTypes.arrayOf(PropTypes.string),
    userBookmarksFetchStatus: PropTypes.object,
    userBookmarksById: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.bool,
    userError: PropTypes.object,
    myFollowedUsers: PropTypes.arrayOf(PropTypes.string),
    // mapDispatchToProps functions
    getStories: PropTypes.func,
    getGuides: PropTypes.func,
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
      case 'GUIDES':
        return this.props.getGuides(this.props.profilesUser.id)
      case 'STORIES':
      default:
        return this.props.getStories(this.props.profilesUser.id)
    }
  }

  componentWillMount() {
    const {loadUserFollowing, myFollowedUsers, sessionUserId} = this.props
    if (!myFollowedUsers && sessionUserId) loadUserFollowing(sessionUserId)
  }

  componentDidMount() {
    const userId = this.props.match.params.userId
    this.props.getUser(userId)
    this.props.getStories(userId)
    this.props.loadBookmarks(userId)
  }

  getFeedItemsByIds(idList, type = 'stories') {
    return idList.map(id => {
      return this.props[type][id]
    })
  }

  getSelectedFeedItems = () => {
    const {
      userStoriesFetchStatus, userStoriesById,
      draftsFetchStatus, draftsById,
      userBookmarksFetchStatus, userBookmarksById,
      guidesFetchStatus, userGuidesById
    } = this.props

    // will use fetchStatus to show loading/error
    switch(this.state.activeTab){
      case 'DRAFTS':
        return {
          fetchStatus: draftsFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(draftsById),
        }
      case 'BOOKMARKS':
        return {
          fetchStatus: userBookmarksFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(userBookmarksById),
        }
      case 'GUIDES':
        return {
          fetchStatus: guidesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(userGuidesById, 'guides')
        }
      case 'STORIES':
      default:
        return {
          fetchStatus: userStoriesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(userStoriesById),
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
      myFollowedUsers, userError,
      userUpdating, updateUser, uploadMedia
    } = this.props
    if (!profilesUser) return null

    let path = match.path.split("/")
    const isEdit = path[path.length-1] === 'edit'
    const isContributor  = profilesUser.role === 'contributor'
    const isUsersProfile = profilesUser.id === sessionUserId
    const isFollowing = _.includes(myFollowedUsers, profilesUser.id)
    const {selectedFeedItems} = this.getselectedFeedItems()
    return (
      <ContentWrapper>
        <ProfileHeader
          user={profilesUser}
          error={userError}
          updating={userUpdating}
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

          { (!!selectedFeedItems.length) &&
          <FeedItemListWrapper>
            <FeedItemList feedItems={selectedFeedItems} />
            <Footer />
          </FeedItemListWrapper>
          }
          {isEdit && <OpaqueCover/>}
        </ListWrapper>
      </ContentWrapper>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const userId = ownProps.match.params.userId
  let {stories, users, guides} = state.entities
  const profilesUser =  users.entities[userId]
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
    userStoriesById: getByUser(stories, userId),
    guidesFetchStatus: guides.fetchStatus,
    userGuidesById: _.get(guides, `guideIdsByUserId[${userId}]`, []),
    draftsFetchStatus: stories.drafts.fetchStatus,
    draftsById: stories.drafts.byId,
    userBookmarksFetchStatus: getBookmarksFetchStatus(stories, userId),
    userBookmarksById: getByBookmarks(users, userId),
    error: stories.error,
    userError: users.error,
    userUpdating: users.updating,
    myFollowedUsers,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    getGuides: (userId) => dispatch(GuideActions.getUserGuides(userId)),
    getDrafts: () => dispatch(StoryActions.loadDrafts()),
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
    getUser: (userId) => dispatch(UserActions.loadUser(userId)),
    deleteStory: (userId, storyId) => dispatch(StoryActions.deleteStory(userId, storyId)),
    loadBookmarks: (userId) => dispatch(StoryActions.getBookmarks(userId)),
    loadUserFollowing: (userId) => dispatch(UserActions.loadUserFollowing(userId)),
    followUser: (sessionUserId, userIdToFollow) => dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
    unfollowUser: (sessionUserId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
    reroute: (path) => dispatch(push(path)),
    uploadMedia: (userId, file, uploadType) => dispatch(MediaUploadActions.uploadRequest(userId, file, uploadType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
