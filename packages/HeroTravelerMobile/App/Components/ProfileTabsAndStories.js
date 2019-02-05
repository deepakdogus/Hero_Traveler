import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
} from 'react-native'

import styles, { feedItemHeight } from './Styles/ProfileTabsAndStoriesStyles'
import { Colors } from '../Shared/Themes'
import ConnectedFeedList from '../Containers/ConnectedFeedList'
import Loader from './Loader'
import ConnectedFeedItemPreview from '../Containers/ConnectedFeedItemPreview'
import TabBar from './TabBar'
import _ from 'lodash'
import { hasBadge } from '../Shared/Lib/badgeHelpers'

export default class ProfileTabsAndStories extends Component {
  static propTypes = {
    editable: PropTypes.bool,
    isStory: PropTypes.bool,
    tabTypes: PropTypes.object,
    renderProfileInfo: PropTypes.func,
    feedItemsById: PropTypes.arrayOf(PropTypes.string),
    fetchStatus: PropTypes.object,
    selectTab: PropTypes.func,
    selectedTab: PropTypes.string,
    showTooltip: PropTypes.bool,
    touchEdit: PropTypes.func,
    touchTrash: PropTypes.func,
    user: PropTypes.object,
    sessionUserId: PropTypes.string,
    location: PropTypes.string,
    error: PropTypes.object,
    onRefresh: PropTypes.func,
  }

  renderTabs(){
    const {tabTypes, selectedTab, selectTab} = this.props
    return (
      <TabBar
        tabs={tabTypes}
        activeTab={selectedTab}
        onClickTab={selectTab}
        tabStyle={styles.tabStyle}
        largeTabBar
      />
    )
  }

  renderFeedItem = (feedItem, index) => {
    const {
      tabTypes, selectedTab, isStory,
      editable, sessionUserId, location,
    } = this.props
    return (
      <ConnectedFeedItemPreview
        isFeed={true}
        isStory={isStory}
        forProfile={true}
        editable={editable && selectedTab !== tabTypes.bookmarks}
        titleStyle={styles.storyTitleStyle}
        subtitleStyle={styles.subtitleStyle}
        feedItem={feedItem}
        userId={sessionUserId}
        height={feedItemHeight}
        autoPlayVideo
        allowVideoPlay
        renderLocation={location}
        index={index}
        showPlayButton
      />
    )
  }

  isFetching(){
    return this.props.fetchStatus && this.props.fetchStatus.fetching
  }

  areNoStories(){
    return this.props.feedItemsById.length === 0
  }

  getNoStoriesText() {
    const {editable, tabTypes, selectedTab, showTooltip} = this.props
    if (showTooltip) return ''
    else if (selectedTab === tabTypes.stories){
      return editable ? 'There are no stories here' : 'This user has no stories published'
    }
    else if (selectedTab === tabTypes.drafts) return 'There are no stories here'
    else if (selectedTab === tabTypes.bookmarks) return 'There are no bookmarked stories here'
    else if (selectedTab === tabTypes.guides) return 'There are no guides here'
    return ''
  }

  isGettingStories() {
    return !this.props.fetchStatus.loaded && this.props.fetchStatus.fetching
  }

  _renderProfileInfo = () => {
    const {renderProfileInfo, error} = this.props
    let errorText = _.get(error, 'message', 'Unable to fully load user data. Please try again.')
    return (
      <View style={styles.topAreaWrapper}>
        {renderProfileInfo()}
        {!!error && (
          <Text style={styles.errorText}>{errorText}</Text>
        )}
      </View>
    )
  }

  getHeaderHeight(){
    // This is quite manual but RN currently doesn't give accurate metrics
    // from .measure() or onLayout. So don't forget to update here if styles
    // change.
    const {user, editable} = this.props

    let height = editable ? 216 : 198
    height += hasBadge(user.role) ? 21 : 0
    height += this.props.error ? 27 : 0
    return height
  }

  render() {
    const {
      renderProfileInfo,
      feedItemsById,
      fetchStatus,
      editable,
      isStory,
      onRefresh,
      selectedTab,
      tabTypes,
    } = this.props

    const isGettingStories = this.isGettingStories()
    const hasNoStories = this.areNoStories()

    return (
      <View style={[
        styles.profileTabsAndStoriesHeight,
        editable ? styles.profileTabsAndStoriesRoot : styles.profileTabsAndStoriesRootWithMarginForNavbar,
      ]}>
        {hasNoStories && this.isFetching() && (
          <View>
            {renderProfileInfo && this._renderProfileInfo()}
            {this.renderTabs()}
          </View>
        )}
        {hasNoStories && fetchStatus.loaded && (
          <View style={styles.noStories}>
            <Text style={styles.noStoriesText}>{this.getNoStoriesText()}</Text>
          </View>
        )}
        {hasNoStories && isGettingStories && (
          <View style={styles.spinnerWrapper}>
            <Loader spinnerColor={Colors.background} />
          </View>
        )}

        {!hasNoStories && (
          <ConnectedFeedList
            isStory={isStory}
            isDraftsTab={selectedTab === tabTypes.drafts}
            style={styles.feedList}
            entitiesById={feedItemsById}
            refreshing={false}
            headerContentHeight={this.getHeaderHeight()}
            renderHeaderContent={this._renderProfileInfo()}
            sectionContentHeight={50}
            renderSectionHeader={this.renderTabs()}
            renderFeedItem={this.renderFeedItem}
            pagingIsDisabled
            onRefresh={onRefresh}
          />
        )}
      </View>
    )
  }
}
