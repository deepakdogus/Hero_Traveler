import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'
import {withHandlers} from 'recompose'

import styles, { storyPreviewHeight } from './Styles/ProfileViewStyles'
import { Colors, Metrics } from '../Shared/Themes'
import StoryList from './StoryList'
import Loader from './Loader'
import ConnectedStoryPreview from '../Containers/ConnectedStoryPreview'

const enhancedTab = withHandlers({
  _onPress: props => () => {
    if (props.onPress) {
      props.onPress(props.type)
    }
  }
})

const Tab = enhancedTab(({text, _onPress, selected, isProfileView}) => {
  return (
    <TouchableWithoutFeedback onPress={_onPress}>
      <View style={[styles.tab, (selected && !isProfileView) ? styles.tabSelected : null]}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
})

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
    showLike: PropTypes.bool,
    user: PropTypes.object,
    location: PropTypes.string,
  }

  renderTabs(){
    const {editable, tabTypes, selectedTab, selectTab} = this.props
    if (editable) return (
      <View style={styles.tabnavEdit}>
        <Tab
          selected={tabTypes.stories === selectedTab}
          type={tabTypes.stories}
          onPress={selectTab}
          text='STORIES' />
        <Tab
          selected={tabTypes.drafts === selectedTab}
          type={tabTypes.drafts}
          onPress={selectTab}
          text='DRAFTS' />
        <Tab
          selected={tabTypes.bookmarks === selectedTab}
          type={tabTypes.bookmarks}
          onPress={selectTab}
          text='BOOKMARKS' />
      </View>
    )
    else return (
      <View style={styles.tabnavEdit}>
        <Tab selected isProfileView text='STORIES' />
      </View>
    )
  }

  renderStory = (storyInfo) => {
    const {
      tabTypes, selectedTab,
      editable, showLike, user, location
    } = this.props
    return (
      <ConnectedStoryPreview
        forProfile={true}
        editable={editable && selectedTab !== tabTypes.bookmarks}
        titleStyle={styles.storyTitleStyle}
        subtitleStyle={styles.subtitleStyle}
        showLike={showLike}
        key={storyInfo.id}
        storyId={storyInfo.id}
        userId={user.id}
        height={storyPreviewHeight}
        autoPlayVideo
        allowVideoPlay
        renderLocation={location}
        index={storyInfo.index}
      />
    )
  }

  isFetching(){
    return this.props.fetchStatus && this.props.fetchStatus.fetching
  }

  areNoStories(){
    const { fetchStatus, storiesById} = this.props
    return fetchStatus.loaded && storiesById.length === 0
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

  render() {
    const {renderProfileInfo, storiesById, fetchStatus, editable} = this.props

    return (
      <View>
        {(this.areNoStories() || this.isFetching()) &&
          <View>
            {renderProfileInfo && renderProfileInfo()}
            {this.renderTabs()}
          </View>
        }
        {storiesById.length === 0 && fetchStatus.loaded &&
          <View style={styles.noStories}>
            <Text style={styles.noStoriesText}>{this.getNoStoriesText()}</Text>
          </View>
        }
        {this.isGettingStories() &&
          <View style={styles.spinnerWrapper}>
            <Loader
              style={styles.spinner}
              spinnerColor={Colors.background} />
          </View>
        }

        {storiesById.length !== 0 && !this.isGettingStories() &&
          <StoryList
            style={editable && {height:  Metrics.screenHeight - Metrics.tabBarHeight}}
            storiesById={storiesById}
            refreshing={false}
            renderHeaderContent={renderProfileInfo()}
            renderSectionHeader={this.renderTabs()}
            renderStory={this.renderStory}
            pagingIsDisabled
          />
        }
      </View>
    )
  }
}
