import React from 'react'
import PropTypes from 'prop-types'
import styles from './Styles/ProfileViewStyles'
import {
  View,
} from 'react-native'
import { connect } from 'react-redux'

import HeroAPI from '../Shared/Services/HeroAPI'
import ProfileUserInfo from './ProfileUserInfo'
import ProfileTabsAndStories from './ProfileTabsAndStories'
import ShadowButton from './ShadowButton'
import Tooltip from './Tooltip'

// @TODO UserActions shouldn't be in a component
import UserActions from '../Shared/Redux/Entities/Users'
import isTooltipComplete, {Types as TooltipTypes} from '../Shared/Lib/firstTimeTooltips'

const api = HeroAPI.create()

export const TabTypes = {
  stories: 'TAB_STORIES',
  drafts: 'TAB_DRAFTS',
  bookmarks: 'TAB_BOOKMARKS',
  guides: 'TAB_GUIDES',
}

const ViewOnlyTabTypes = {
  stories: 'TAB_STORIES',
  guides: 'TAB_GUIDES',
}

class ProfileView extends React.Component {

  static defaultProps = {
    onPressFollow: () => {},
    bookmarksFetchStatus: {},
    draftsFetchStatus: {},
    storiesFetchStatus: {},
    guidesFetchStatus: {},
  }

  static propTypes = {
    userId: PropTypes.string,
    location: PropTypes.string,
    error: PropTypes.object,
    refresh: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: TabTypes.stories,
      imageMenuOpen: false,
      file: null,
      bioText: props.user.bio || '',
      usernameText: props.user.username || 'Enter a username',
      aboutText: props.user.about || '',
    }
  }

  componentDidMount() {
    api.setAuth(this.props.accessToken)
  }

  componentWillReceiveProps(newProps) {
    if ((this.props.location !== newProps.location) && (this.state.selectedTab !== TabTypes.stories)) {
      this.setState({
        selectedTab: TabTypes.stories
      })
    }
    if (!this.hasCompletedNoStoriesTooltip() && newProps.stories.length){
      this._completeTooltip()
    }
  }

  _completeTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.PROFILE_NO_STORIES,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  selectTab = (tab) => {
    if (this.state.selectedTab !== tab) {
      this.setState({selectedTab: tab})
    }
  }

  _setText = (usernameText) => this.setState({usernameText})
  _setAbout = (aboutText) => this.setState({aboutText})
  _setBioText = (bioText) => this.setState({bioText})
  _clearError = () => this.setState({error: null})

  _bioRef = c => this.bioInput = c

  getFeedItemsById() {
    const {drafts, bookmarks, stories, guideIds} = this.props
    if (this.state.selectedTab === TabTypes.stories) return stories
    else if (this.state.selectedTab === TabTypes.drafts) return drafts
    else if (this.state.selectedTab === TabTypes.bookmarks) return bookmarks
    else if (this.state.selectedTab === TabTypes.guides) return guideIds
  }

  getFetchStatus(){
    const {selectedTab} = this.state
    if (selectedTab === TabTypes.stories) return this.props.fetchStatus
    else if (selectedTab === TabTypes.drafts) return this.props.draftsFetchStatus
    else if (selectedTab === TabTypes.bookmarks) return this.props.bookmarksFetchStatus
    else if (selectedTab === TabTypes.guides) return this.props.guidesFetchStatus
  }

  renderProfileInfo = () => {
    const {
      user, editable,
      isFollowing, onPressFollow, onPressUnfollow
    } = this.props
    return (
      <ProfileUserInfo
        user={user}
        editable={editable}
        isFollowing={isFollowing}
        onPressUnfollow={onPressUnfollow}
        onPressFollow={onPressFollow}
        usernameText={this.state.usernameText}
        setUsername={this._setText}
        aboutText={this.state.aboutText}
        setAbout={this._setAbout}
      />
    )
  }

  hasCompletedNoStoriesTooltip() {
    return isTooltipComplete(
      TooltipTypes.PROFILE_NO_STORIES,
      this.props.user.introTooltips
    )
  }

  getProfileTabsAndStoriesError(){
    const {selectedTab} = this.state
    const {error, bookmarksError} = this.props
    if (selectedTab === TabTypes.bookmarks) return bookmarksError || error
    else return error
  }

  render() {
    const {editable, location, stories, user, userId, onRefresh} = this.props
    const {selectedTab} = this.state

    let showTooltip = editable &&
      !stories.length && !this.hasCompletedNoStoriesTooltip()

    return (
      <View style={styles.flexOne}>
        <View style={styles.gradientWrapper}>
          <ProfileTabsAndStories
            editable={editable}
            isStory={selectedTab !== TabTypes.guides}
            renderProfileInfo={this.renderProfileInfo}
            feedItemsById={this.getFeedItemsById()}
            fetchStatus={this.getFetchStatus()}
            tabTypes={editable ? TabTypes : ViewOnlyTabTypes}
            selectTab={this.selectTab}
            selectedTab={selectedTab}
            user={user}
            sessionUserId={userId}
            showTooltip={showTooltip}
            location={location}
            error={this.getProfileTabsAndStoriesError()}
            onRefresh={onRefresh}
          />
        </View>
        {this.state.error &&
          <ShadowButton
            style={styles.errorButton}
            onPress={this._clearError}
            text={this.state.error}
          />
        }
        {showTooltip &&
          <Tooltip
            position='bottom-center'
            text={"Looks like you don't have any stories.\nPublish your first story now!"}
            onDismiss={this._completeTooltip}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const userId = state.session.userId;
  // If the signup process is not completed, a user can still login but they don't have some entities set.
  const hasBookmarks = !!state.entities.stories.bookmarks && !!state.entities.stories.bookmarks[userId];
  return {
    userId,
    location: state.routes.scene.name,
    error: state.entities.users.error,
    bookmarksError: hasBookmarks ? state.entities.stories.bookmarks[userId].fetchStatus.error : undefined,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips})),
    updateUserSuccess: (user) => dispatch(UserActions.updateUserSuccess(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
