import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
} from 'react-native'

import styles, { feedItemHeight } from './Styles/ProfileViewStyles'
import { Colors } from '../Shared/Themes'
import ConnectedFeedList from '../Containers/ConnectedFeedList'
import Loader from './Loader'
import ConnectedFeedItemPreview from '../Containers/ConnectedFeedItemPreview'
import TabBar from './TabBar'
import _ from 'lodash'

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
    sessionUserId: PropTypes.string,
    location: PropTypes.string,
    error: PropTypes.object,
  }

  renderTabs(){
    const {tabTypes, selectedTab, selectTab} = this.props
    return (
      <TabBar
        tabs={tabTypes}
        activeTab={selectedTab}
        onClickTab={selectTab}
        tabStyle={styles.tabStyle}
      />
    )
  }

  renderStory = (story, index) => {
    const {
      tabTypes, selectedTab,
      editable, sessionUserId, location
    } = this.props
    return (
      <ConnectedFeedItemPreview
        isFeed={true}
        isStory={true}
        forProfile={true}
        editable={editable && selectedTab !== tabTypes.bookmarks}
        titleStyle={styles.storyTitleStyle}
        subtitleStyle={styles.subtitleStyle}
        story={story}
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
    return this.props.storiesById.length === 0
  }

  getNoStoriesText() {
    const {editable, tabTypes, selectedTab, showTooltip} = this.props
    if (showTooltip) return ''
    else if (selectedTab === tabTypes.stories){
      return editable ? 'There are no stories here' : 'This user has no stories published'
    }
    else if (selectedTab === tabTypes.drafts) return 'There are no stories here'
    else if (selectedTab === tabTypes.bookmarks) return 'There are no bookmarked stories here'
    return ''
  }

  isGettingStories() {
    return !this.props.fetchStatus.loaded && this.props.fetchStatus.fetching
  }

  _renderProfileInfo = () => {
    const {renderProfileInfo, error} = this.props
    let errorText = _.get(error, 'message', 'Unable to fully load user data. Please try again.');
    return (
      <View style={styles.topAreaWrapper}>
        {renderProfileInfo()}
        {!!error &&
          <Text style={styles.errorText}>{errorText}</Text>
        }
      </View>
    )
  }

  getHeaderHeight(){
    // This is quite manual but RN currently doesn't give accurate metrics
    // from .measure() or onLayout. So don't forget to update here if styles
    // change.
    const {user, editable} = this.props
    const hasBadge = user.role === 'contributor' || user.role === 'founding member'
    let height = editable ? 237 : 219
    height += hasBadge ? 21 : 0
    height += this.props.error ? 27 : 0
    return height
  }

  render() {
    const {renderProfileInfo, storiesById, fetchStatus, editable} = this.props
    const isGettingStories = this.isGettingStories()

    return (
      <View style={[
        styles.profileTabsAndStoriesHeight,
        editable ? styles.profileTabsAndStoriesRoot : styles.profileTabsAndStoriesRootWithMarginForNavbar
      ]}>
        {(this.areNoStories() || this.isFetching()) &&
          <View>
            {renderProfileInfo && this._renderProfileInfo()}
            {this.renderTabs()}
          </View>
        }
        {storiesById.length === 0 && fetchStatus.loaded &&
          <View style={styles.noStories}>
            <Text style={styles.noStoriesText}>{this.getNoStoriesText()}</Text>
          </View>
        }
        {isGettingStories &&
          <View style={styles.spinnerWrapper}>
            <Loader
              style={styles.spinner}
              spinnerColor={Colors.background} />
          </View>
        }

        {storiesById.length !== 0 && !isGettingStories &&
          <ConnectedFeedList
            isStory={true}
            style={styles.feedList}
            storiesById={storiesById}
            refreshing={false}
            headerContentHeight={this.getHeaderHeight()}
            renderHeaderContent={this._renderProfileInfo()}
            renderSectionHeader={this.renderTabs()}
            renderStory={this.renderStory}
            pagingIsDisabled
          />
        }
      </View>
    )
  }
}
