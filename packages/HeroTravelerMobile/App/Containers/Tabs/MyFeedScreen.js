import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { View, Linking, TouchableOpacity, Alert, Platform } from 'react-native'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import { Actions as NavActions } from 'react-native-router-flux'
import { getAppstoreAppVersion } from 'react-native-appstore-version-checker'
import VersionNumber from 'react-native-version-number'

import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper'

import StoryActions from '../../Shared/Redux/Entities/Stories'
import PendingUpdatesActions from '../../Shared/Redux/PendingUpdatesRedux'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'

import { Metrics } from '../../Shared/Themes'
import styles from '../Styles/MyFeedScreenStyles'
import env from '../../Config/Env'

import ConnectedFeedList from '../../Containers/ConnectedFeedList'
import ConnectedFeedItemPreview from '../ConnectedFeedItemPreview'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import BackgroundPublishingBars from '../../Components/BackgroundPublishingBars'
import TabBar from '../../Components/TabBar'
import SearchPlacesPeople from '../SearchPlacesPeople'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

const tabTypes = {
  following: 'following',
  guides: 'guides',
  nearby: 'nearby',
  fromUs: 'from us',
}

const algoliasearch = algoliasearchModule(
  env.SEARCH_APP_NAME,
  env.SEARCH_API_KEY,
)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const MAX_STORY_RESULTS = 100
const ONE_HUNDRED_MILES = 160934 // 100 miles in meters

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.object,
    feedGuidesById: PropTypes.arrayOf(PropTypes.string),
    attemptGetUserFeedStories: PropTypes.func,
    attemptGetBadgeUserStories: PropTypes.func,
    attemptGetNearbyFeedStories: PropTypes.func,
    attemptGetUserFeedGuides: PropTypes.func,
    userId: PropTypes.string,
    location: PropTypes.string,
    sync: PropTypes.object,
    fetchStatus: PropTypes.object,
    userFeedById: PropTypes.arrayOf(PropTypes.string),
    nearbyFeedById: PropTypes.arrayOf(PropTypes.string),
    badgeUserFeedById: PropTypes.arrayOf(PropTypes.string),
    stories: PropTypes.object,
    pendingUpdates: PropTypes.object,
    updateDraft: PropTypes.func,
    saveLocalDraft: PropTypes.func,
    discardUpdate: PropTypes.func,
    discardNearbyFeedStories: PropTypes.func,
    resetFailCount: PropTypes.func,
    updateOrder: PropTypes.arrayOf(PropTypes.string),
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      activeTab: tabTypes.following,
      hasSearchText: false,
      permissionStatus: undefined,
      needToUpdateApp: false,
    }
  }

  componentDidMount() {
    if (!this.isPendingUpdate()) {
      this.props.attemptGetUserFeedStories(this.props.userId)
      this.props.attemptGetUserFeedGuides(this.props.userId)
      this.props.attemptGetBadgeUserStories()
    }
    if (this.props.user.usernameIsTemporary === true) {
      NavActions.signupFlow()
    }
    SplashScreen.hide()

    // check app store version
    if (!__DEV__) {
      getAppstoreAppVersion('1288145566') //put any apps id here
        .then(versionOnAppStore => {
          const appStoreVersion = versionOnAppStore.split('.') //split into 3 parts. example: 1.05.12
          const currentVersion = VersionNumber.appVersion.split('.')
          if(Number(appStoreVersion[0] - currentVersion[0]) >= 1) this.setState({needToUpdateApp: true})
        })
        .catch(err => {
          console.log('error occurred', err)
        })
    }

    // search helper
    this.helper = AlgoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.helper.on('result', res => {
      const nearbyStoryIds = res.hits.map(story => story.id)
      this.props.attemptGetNearbyFeedStories(nearbyStoryIds)
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) this.getEntitiesByType()
  }

  componentWillUnmount() {
    // reset to data needed for first/default tab to avoid flash when user returns to feed
    this.props.attemptGetUserFeedStories()
    this.props.attemptGetUserFeedGuides()
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = _.some([
      this.props.userFeedById !== nextProps.userFeedById,
      this.props.nearbyFeedById !== nextProps.nearbyFeedById,
      this.props.badgeUserFeedById !== nextProps.badgeUserFeedById,
      this.props.fetchStatus !== nextProps.fetchStatus,
      this.props.error !== nextProps.error,
      !_.isEqual(this.props.sync, nextProps.sync),
      !_.isEqual(this.props.pendingUpdates, nextProps.pendingUpdates),
      this.state.activeTab !== nextState.activeTab,
      this.state.hasSearchText !== nextState.hasSearchText,
    ])
    return shouldUpdate
  }

  searchNearbyStories() {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        this.helper
          .setQuery('')
          .setQueryParameter('aroundLatLng', `${latitude}, ${longitude}`)
          .setQueryParameter('aroundRadius', ONE_HUNDRED_MILES)
          .setQueryParameter('hitsPerPage', MAX_STORY_RESULTS)
          .search()
        this.setState({ permissionStatus: 'GRANTED' })
      },
      error => {
        console.error(error)
        // if user has changed location settings to 'DENIED' in the middle of a session,
        // clear all cached nearby stories
        if (error.code && error.code === 1)
          this.props.discardNearbyFeedStories()
        this.setState({ permissionStatus: 'DENIED' })
      },
      {enableHighAccuracy: true},
    )
  }

  isPendingUpdate() {
    const { sync } = this.props
    return (
      sync.syncProgressSteps
      && sync.syncProgressSteps !== sync.syncProgress
      && !sync.error
    )
  }

  isFailedLoad(nextProps) {
    return (
      nextProps.error
      && this.props.fetchStatus.fetching
      && !nextProps.fetchStatus.fetching
    )
  }

  isStoryTabSelected = () =>
    [tabTypes.following, tabTypes.nearby, tabTypes.fromUs].includes(
      this.state.activeTab,
    )

  openSettings = () => Linking.openURL('app-settings:')

  _wrapElt(elt) {
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>{elt}</View>
    )
  }

  _showNoStories() {
    const { permissionStatus, activeTab } = this.state
    const needsLocationPermission
      = activeTab === tabTypes.nearby && permissionStatus === 'DENIED'

    let text = ''
    switch (activeTab) {
      case tabTypes.following:
        text = `You aren't following any users yet.`
        break
      case tabTypes.guides:
        text = `There are no guides to display.`
        break
      case tabTypes.featured:
      case tabTypes.trending:
        text = `There are no ${this.state.activeTab} stories to show right now.`
        break
      case tabTypes.nearby:
        text = `There are no stories within a hundred miles of you or we couldn't determine your location.`
        break
      default:
        text = `There is no content available. Check back later.`
    }

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.tabWrapper}>{this.renderTabs()}</View>
        {!needsLocationPermission && <NoStoriesMessage text={text} />}
        {needsLocationPermission && (
          <TouchableOpacity onPress={this.openSettings}>
            <NoStoriesMessage
              text={`Location Services must be enabled to view nearby stories. Click here to go to the Settings App.`}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  _onRefresh = () => {
    if (this.isPendingUpdate()) return
    this.setState({ refreshing: true })
    this.getEntitiesByType()
  }

  renderFeedItem = (feedItem, index) => {
    return (
      <ConnectedFeedItemPreview
        index={index}
        isFeed={true}
        isStory={this.isStoryTabSelected()}
        feedItem={feedItem}
        height={imageHeight}
        userId={this.props.userId}
        autoPlayVideo
        allowVideoPlay
        renderLocation={this.props.location}
        showPlayButton={true}
      />
    )
  }

  getFirstPendingFailure() {
    const { pendingUpdates, updateOrder } = this.props
    const firstFailureKey = updateOrder.find(key => {
      const pendingUpdate = pendingUpdates[key] || {}
      return pendingUpdate.failCount >= 5
    })
    if (firstFailureKey) return pendingUpdates[firstFailureKey]
    return undefined
  }

  getLocationPermission = () => {
    if (!this.state.permissionStatus)
      navigator.geolocation.requestAuthorization()
  }

  getEntitiesById() {
    switch (this.state.activeTab) {
      case tabTypes.guides:
        return this.props.feedGuidesById
      case tabTypes.nearby:
        return this.props.nearbyFeedById
      case tabTypes.fromUs:
        return this.props.badgeUserFeedById
      case tabTypes.following:
      default:
        return this.props.userFeedById
    }
  }

  getEntitiesByType = () => {
    const { activeTab } = this.state
    switch (activeTab) {
      case tabTypes.nearby:
        return this.searchNearbyStories()
      case tabTypes.fromUs:
        return this.props.attemptGetBadgeUserStories()
      case tabTypes.guides:
        return this.props.attemptGetUserFeedGuides(this.props.userId)
      case tabTypes.following:
      default:
        return this.props.attemptGetUserFeedStories(this.props.userId)
    }
  }

  selectTab = activeTab => {
    if (activeTab === tabTypes.nearby) this.getLocationPermission()
    this.setState({ activeTab })
  }

  renderTabs() {
    const { activeTab } = this.state
    return (
      <TabBar
        tabs={tabTypes}
        activeTab={activeTab}
        onClickTab={this.selectTab}
        tabStyle={styles.tabStyle}
      />
    )
  }

  updateAppNotice(){
    const APP_STORE_LINK = 'https://itunes.apple.com/us/app/hero-traveler/id1288145566?mt=8'
    Alert.alert(
      'Update Available',
      'This version of the app is outdated. Please update app from the ' + (Platform.OS === 'ios' ? 'App Store' : 'Play Store') + '.',
      [
        {text: 'Update Now',
          onPress: () => {
            if(Platform.OS === 'ios'){
              Linking.openURL(APP_STORE_LINK).catch(err => console.error('An error occurred', err))
            }
          }},
      ],
    )
  }

  render() {
    let { fetchStatus, sync, stories, user } = this.props
    const { needToUpdateApp} = this.state
    const failure = this.getFirstPendingFailure()
    const isStoryTabSelected = this.isStoryTabSelected()
    const entitiesById = this.getEntitiesById() || []

    let bottomContent
    bottomContent = (
      <ConnectedFeedList
        isStory={isStoryTabSelected}
        entitiesById={entitiesById}
        renderFeedItem={this.renderFeedItem}
        renderSectionHeader={this.renderTabs()}
        sectionContentHeight={40}
        onRefresh={this._onRefresh}
        refreshing={fetchStatus.fetching}
      />
    )
    if (!entitiesById || !entitiesById.length) {
      let innerContent = this._showNoStories()
      bottomContent = this._wrapElt(innerContent)
    }

    return (
      <View style={styles.statusBarAvoider}>
        {needToUpdateApp ? this.updateAppNotice() : null}
        <BackgroundPublishingBars
          sync={sync}
          failure={failure}
          updateDraft={this.props.updateDraft}
          saveLocalDraft={this.props.saveLocalDraft}
          discardUpdate={this.props.discardUpdate}
          resetFailCount={this.props.resetFailCount}
        />
        <SearchPlacesPeople
          stories={stories}
          user={user}
          placeholder={`Search`}
          >
          {bottomContent}
        </SearchPlacesPeople>
      </View>
    )
  }
}

const mapStateToProps = state => {
  let {
    userFeedById,
    nearbyFeedById,
    badgeUserFeedById,
    fetchStatus,
    error,
  } = state.entities.stories
  const feedGuidesById = state.entities.guides.feedGuidesById || []
  return {
    userId: state.session.userId,
    user: state.entities.users.entities[state.session.userId],
    fetchStatus,
    userFeedById,
    nearbyFeedById,
    badgeUserFeedById,
    feedGuidesById,
    error,
    location: state.routes.scene.name,
    sync: state.storyCreate.sync,
    pendingUpdates: state.pendingUpdates.pendingUpdates,
    updateOrder: state.pendingUpdates.updateOrder,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    attemptGetUserFeedStories: userId =>
      dispatch(StoryActions.feedRequest(userId)),
    attemptGetNearbyFeedStories: nearbyStoryIds =>
      dispatch(StoryActions.nearbyFeedRequest(nearbyStoryIds)),
    attemptGetBadgeUserStories: () =>
      dispatch(StoryActions.badgeUserFeedRequest()),
    attemptGetUserFeedGuides: userId =>
      dispatch(GuideActions.guideFeedRequest(userId)),
    discardNearbyFeedStories: () =>
      dispatch(StoryActions.nearbyFeedSuccess([], 0, {})),
    discardUpdate: storyId =>
      dispatch(PendingUpdatesActions.removePendingUpdate(storyId)),
    resetFailCount: storyId =>
      dispatch(PendingUpdatesActions.resetFailCount(storyId)),
    saveLocalDraft: story => dispatch(StoryCreateActions.saveLocalDraft(story)),
    updateDraft: story =>
      dispatch(StoryCreateActions.updateDraft(story.id, story, true)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyFeedScreen)
