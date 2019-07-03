import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'

import StoryActions, {
  getByCategory,
  getFetchStatus,
  getByUser,
} from '../../Shared/Redux/Entities/Stories'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import SignupActions from '../../Shared/Redux/SignupRedux'
import UserActions, { getFollowers } from '../../Shared/Redux/Entities/Users'

import ConnectedFeedItemPreview from '../ConnectedFeedItemPreview'
import ConnectedFeedList from '../../Containers/ConnectedFeedList'
import Loader from '../../Components/Loader'

import { Metrics } from '../../Shared/Themes'
import styles from '../Styles/CategoryFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import TabBar from '../../Components/TabBar'
import NavBar from '../CreateStory/NavBar'

const imageHeight
  = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight - 40

// const tabTypes = {
//   all: null,
//   see: 'see',
//   do: 'do',
//   eat: 'eat',
//   stay: 'stay',
//   guides: 'guides',
// }

// removing story subtypes for now, to add back replace all instances of
// `restrictedTabTypes` with `tabTypes`
const restrictedTabTypes = {
  stories: 'stories',
  guides: 'guides',
}

class GridItemFeedScreen extends React.Component {
  static propTypes = {
    profileId: PropTypes.string,
    user: PropTypes.object,
    storiesById: PropTypes.array,
    categoryGuidesById: PropTypes.arrayOf(PropTypes.string),
    fetchStatus: PropTypes.object,
    error: PropTypes.object,
    title: PropTypes.string,
    loadCategoryStories: PropTypes.func,
    loadCategoryGuides: PropTypes.func,
    loadUserStories: PropTypes.func,
    loadUserGuides: PropTypes.func,
    userChannelName: PropTypes.func,
    getSelectedCategories: PropTypes.func,
    unfollowCategory: PropTypes.func,
    followCategory: PropTypes.func,
    selectedCategories: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      selectedTab: restrictedTabTypes.stories,
    }
  }

  loadStories() {
    this.props.isChannel
      ? this.props.loadUserStories(this.props.profileId)
      : this.props.loadCategoryStories(this.props.profileId)
  }

  loadGuides() {
    this.props.isChannel
    ? this.props.loadUserGuides(this.props.profileId)
    : this.props.loadCategoryGuides(this.props.profileId)
  }

  loadData() {
    this.loadStories()
    this.loadGuides()
  }

  componentDidMount() {
    this.loadData()
    this.props.getSelectedCategories()
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.refreshing && nextProps.fetchStatus.loaded) {
      this.setState({ refreshing: false })
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.loadData()
  }

  _wrapElt = elt => (
    <View style={[styles.scrollItemFullScreen, styles.center]}>{elt}</View>
  )

  _changeTab = selectedTab => {
    if (selectedTab !== restrictedTabTypes.guides) this.loadStories()
    if (selectedTab !== restrictedTabTypes.stories) this.loadGuides()
    this.setState({
      selectedTab,
    })
  }

  renderFeedItem = (feedItem, index) => {
    return (
      <ConnectedFeedItemPreview
        isStory={this.state.selectedTab !== restrictedTabTypes.guides}
        feedItem={feedItem}
        height={imageHeight}
        userId={this.props.user.id}
        autoPlayVideo
        allowVideoPlay
        renderLocation={this.props.location}
        index={index}
        showPlayButton={true}
      />
    )
  }

  _onLeft = () => NavActions.pop()

  _onRight = () => {
    const { user } = this.props
    const shouldUnfollow = this.getIsFollowingCategory()
    if (shouldUnfollow) this.props.unfollowProfile(user.id)
    else this.props.followProfile(user.id)
  }

  getIsFollowingCategory = () => {
    const { profileId, selectedCategories, myFollowedUsers, isChannel, user } = this.props
    return isChannel
            ? _.includes(myFollowedUsers, profileId)
            : _.includes(selectedCategories, profileId)
  }

  renderTabs() {
    return (
      <TabBar
        tabs={restrictedTabTypes}
        activeTab={this.state.selectedTab}
        onClickTab={this._changeTab}
        tabStyle={styles.tabStyle}
      />
    )
  }

  renderNoStories = content => {
    return (
      <View style={styles.noStoriesWrapper}>
        {this.renderTabs()}
        {content}
      </View>
    )
  }

  render() {
    let {
      storiesById,
      fetchStatus,
      error,
      title,
      categoryGuidesById,
      userChannelName,
    } = this.props
    const { selectedTab, refreshing } = this.state
    const isFollowingCategory = this.getIsFollowingCategory()

    let topContent, bottomContent
    if (error) {
      topContent = this._wrapElt(
        <Text style={styles.message}>
          Unable to find new content. Pull down to refresh.
        </Text>,
      )
    }

    if (fetchStatus.fetching && !refreshing) {
      bottomContent = this.renderNoStories(<Loader />)
    }
    else if (
      (selectedTab !== restrictedTabTypes.guides && _.size(storiesById) === 0)
      || (selectedTab === restrictedTabTypes.guides && _.size(categoryGuidesById) === 0)
    ) {
      bottomContent = this.renderNoStories(
        <NoStoriesMessage
          text={`There are no ${
            selectedTab === restrictedTabTypes.guides ? 'guides' : 'stories'
          } for this category`}
        />,
      )
    }
    else {
      bottomContent = (
        <ConnectedFeedList
          isStory={selectedTab !== restrictedTabTypes.guides}
          entitiesById={
            selectedTab === restrictedTabTypes.guides ? categoryGuidesById : storiesById
          }
          renderSectionHeader={this.renderTabs()}
          sectionContentHeight={40}
          renderFeedItem={this.renderFeedItem}
          onRefresh={this._onRefresh}
          refreshing={refreshing}
        />
      )
    }

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <NavBar
          title={title || userChannelName.username}
          titleStyle={styles.navbarTitleStyle}
          onLeft={this._onLeft}
          leftIcon="arrowLeft"
          onRight={this._onRight}
          rightTextStyle={
            isFollowingCategory ? styles.followingTextStyle : styles.followTextStyle
          }
          rightTitle={isFollowingCategory ? 'FOLLOWING' : '+ FOLLOW'}
          style={styles.navbarContainer}
        />
        {topContent}
        {bottomContent}
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const guidePath = props.isChannel
    ? `entities.guides.guideIdsByUserId[${props.profileId}]`
    : `entities.guides.guideIdsByCategoryId[${props.profileId}]`
  return {
    user: state.entities.users.entities[state.session.userId],
    fetchStatus: getFetchStatus(state.entities.stories, props.profileId),
    storiesById: props.isChannel
      ? getByUser(state.entities.stories, props.profileId)
      : getByCategory(state.entities.stories, props.profileId),
    categoryGuidesById: _.get(state, guidePath, []),
    error: state.entities.stories.error,
    selectedCategories: state.signup.selectedCategories,
    location: state.routes.scene.name,
    userChannelName: state.entities.users.entities[props.profileId],
    myFollowedUsers: getFollowers(state.entities.users, 'following', state.session.userId),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { isChannel, profileId } = ownProps
  return {
    loadCategoryGuides: categoryId =>
      dispatch(GuideActions.getCategoryGuides(categoryId)),
    loadCategoryStories: (categoryId, storyType) =>
      dispatch(StoryActions.fromCategoryRequest(categoryId, storyType)),
    loadUserStories: userId => dispatch(StoryActions.fromUserRequest(userId)),
    loadUserGuides: userId => dispatch(GuideActions.getUserGuides(userId)),
    getSelectedCategories: () => dispatch(SignupActions.signupGetUsersCategories()),
    followProfile: (userId) =>
      dispatch(isChannel
                ? UserActions.followUser(userId, profileId)
                : SignupActions.signupFollowCategory(profileId)),
    unfollowProfile: (userId) =>
      dispatch(isChannel
                ? SignupActions.signupUnfollowCategory(ownProps.profileId)
                : UserActions.unfollowUser(userId, profileId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GridItemFeedScreen)
