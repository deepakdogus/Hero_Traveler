import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableWithoutFeedback } from 'react-native'

import styles, { storyPreviewHeight } from './Styles/ProfileViewStyles'
import { Colors, Metrics } from '../Shared/Themes'
import StoryList from '../Containers/ConnectedStoryList'
import Loader from './Loader'
import ConnectedStoryPreview from '../Containers/ConnectedStoryPreview'

import Tabs from './Tabs'
import Tab from './Tab'

export default class ProfileTabsAndStories extends Component {
  static propTypes = {
    editable: PropTypes.bool,
    tabTypes: PropTypes.object,
    renderProfileInfo: PropTypes.func,
    storiesById: PropTypes.arrayOf(PropTypes.string),
    fetchStatus: PropTypes.object,
    selectTab: PropTypes.func,
    selectedTab: PropTypes.string,
    showTooltip: PropTypes.bool,
    touchEdit: PropTypes.func,
    touchTrash: PropTypes.func,
    user: PropTypes.object,
    location: PropTypes.string,
    error: PropTypes.object,
  }

  renderTabs() {
    const { editable, tabTypes, selectedTab, selectTab } = this.props
    if (editable)
      return (
        <Tabs>
          <Tab
            tabStyles={styles.tabStyles}
            selected={tabTypes.stories === selectedTab}
            type={tabTypes.stories}
            onPress={() => selectTab(tabTypes.stories)}
            text="STORIES"
          />
          <Tab
            tabStyles={styles.tabStyles}
            selected={tabTypes.drafts === selectedTab}
            type={tabTypes.drafts}
            onPress={() => selectTab(tabTypes.drafts)}
            text="DRAFTS"
          />
          <Tab
            tabStyles={styles.tabStyles}
            selected={tabTypes.bookmarks === selectedTab}
            type={tabTypes.bookmarks}
            onPress={() => selectTab(tabTypes.bookmarks)}
            text="BOOKMARKS"
          />
          <Tab
            tabStyles={styles.tabStyles}
            selected={tabTypes.stories === selectedTab}
            type={tabTypes.stories}
            onPress={() => selectTab(tabTypes.stories)}
            text="GUIDES"
          />
        </Tabs>
      )
    else
      return (
        <Tabs>
          <Tab
            tabStyles={styles.tabStyles}
            selected={tabTypes.stories === selectedTab}
            type={tabTypes.stories}
            onPress={() => selectTab(tabTypes.stories)}
            text="STORIES"
          />
          <Tab
            tabStyles={styles.tabStyles}
            selected={tabTypes.stories === selectedTab}
            type={tabTypes.stories}
            onPress={() => selectTab(tabTypes.stories)}
            text="GUIDES"
          />
        </Tabs>
      )
  }

  renderStory = (story, index) => {
    const { tabTypes, selectedTab, editable, user, location } = this.props
    return (
      <ConnectedStoryPreview
        isFeed={true}
        forProfile={true}
        editable={editable && selectedTab !== tabTypes.bookmarks}
        titleStyle={styles.storyTitleStyle}
        subtitleStyle={styles.subtitleStyle}
        story={story}
        userId={user.id}
        height={storyPreviewHeight}
        autoPlayVideo
        allowVideoPlay
        renderLocation={location}
        index={index}
        showPlayButton
      />
    )
  }

  isFetching() {
    return this.props.fetchStatus && this.props.fetchStatus.fetching
  }

  areNoStories() {
    return this.props.storiesById.length === 0
  }

  getNoStoriesText() {
    const { editable, tabTypes, selectedTab, showTooltip } = this.props
    if (showTooltip) return ''
    else if (selectedTab === tabTypes.stories) {
      return editable
        ? 'There are no stories here'
        : 'This user has no stories published'
    } else if (selectedTab === tabTypes.drafts)
      return 'There are no stories here'
    else if (selectedTab === tabTypes.bookmarks)
      return 'There are no bookmarked stories here'
    return ''
  }

  isGettingStories() {
    return !this.props.fetchStatus.loaded && this.props.fetchStatus.fetching
  }

  _renderProfileInfo = () => {
    const { renderProfileInfo, error } = this.props
    return (
      <View>
        {renderProfileInfo()}
        {!!error && (
          <Text style={styles.errorText}>
            Unable to fully load user data. Please try again.
          </Text>
        )}
      </View>
    )
  }

  getHeaderHeight() {
    const { user, editable } = this.props
    const hasBadge =
      user.role === 'contributor' || user.role === 'founding member'
    let baseHeight = editable ? 201.5 : 171
    baseHeight += hasBadge ? 21 : 0
    return baseHeight
  }

  render() {
    const { renderProfileInfo, storiesById, fetchStatus, editable } = this.props
    const isGettingStories = this.isGettingStories()

    return (
      <View
        style={[
          styles.profileTabsAndStoriesHeight,
          editable
            ? styles.profileTabsAndStoriesRoot
            : styles.profileTabsAndStoriesRootWithMarginForNavbar,
        ]}>
        {(this.areNoStories() || this.isFetching()) && (
          <View>
            {renderProfileInfo && this._renderProfileInfo()}
            {this.renderTabs()}
          </View>
        )}
        {storiesById.length === 0 &&
          fetchStatus.loaded && (
            <View style={styles.noStories}>
              <Text style={styles.noStoriesText}>
                {this.getNoStoriesText()}
              </Text>
            </View>
          )}
        {isGettingStories && (
          <View style={styles.spinnerWrapper}>
            <Loader style={styles.spinner} spinnerColor={Colors.background} />
          </View>
        )}

        {storiesById.length !== 0 &&
          !isGettingStories && (
            <StoryList
              style={styles.storyList}
              storiesById={storiesById}
              refreshing={false}
              headerContentHeight={this.getHeaderHeight()}
              renderHeaderContent={this._renderProfileInfo()}
              renderSectionHeader={this.renderTabs()}
              renderStory={this.renderStory}
              pagingIsDisabled
            />
          )}
      </View>
    )
  }
}
