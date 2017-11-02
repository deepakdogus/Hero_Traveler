import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import UserActions, {getByBookmarks} from '../Shared/Redux/Entities/Users'
import StoryActions, {getByUser, getUserFetchStatus, getBookmarksFetchStatus} from '../Shared/Redux/Entities/Stories'

import ProfileHeader from '../Components/ProfileHeader/ProfileHeader'
import TabBar from '../Components/TabBar'
import StoryList from '../Components/StoryList'
import Footer from '../Components/Footer'

const tabBarTabs = ['STORIES', 'DRAFTS', 'BOOKMARKS']

const ContentWrapper = styled.div``

const StoryListWrapper = styled.div`
  margin: 50px 7% 0;
`

class Profile extends Component {
  static propTypes = {
    match: PropTypes.object,

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

    getStories: PropTypes.func,
    getDrafts: PropTypes.func,
    updateUser: PropTypes.func,
    getUser: PropTypes.func,
    deleteStory: PropTypes.func,
    loadBookmarks: PropTypes.func,
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

  render() {
    const {match, profilesUser, users, sessionUserId} = this.props
    if (!profilesUser) return null

    let path = match.path.split("/")
    const isEdit = path[path.length-1] === 'edit'
    const isContributor = profilesUser.role === 'contributor'
    const isUsersProfile = profilesUser.id === sessionUserId

    const {selectedStories} = this.getSelectedStories()
    return (
      <ContentWrapper>
        <ProfileHeader
          user={profilesUser}
          isContributor={isContributor}
          isEdit={isEdit}
          isUsersProfile={isUsersProfile}
        />
        <TabBar
          tabs={tabBarTabs}
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
      </ContentWrapper>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const userId = ownProps.match.params.userId
  let {stories, users} = state.entities
  const profilesUser =  users.entities[userId]
  return {
    sessionUserId: state.session.userId,
    profilesUser,
    users: users.entities,
    stories: stories.entities,
    userStoriesFetchStatus: getUserFetchStatus(stories, userId),
    userStoriesById: getByUser(stories, userId),
    draftsFetchStatus: stories.drafts.fetchStatus,
    draftsById: stories.drafts.byId,
    userBookmarksFetchStatus: getBookmarksFetchStatus(stories, userId),
    userBookmarksById: getByBookmarks(users, userId),
    error: stories.error
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
