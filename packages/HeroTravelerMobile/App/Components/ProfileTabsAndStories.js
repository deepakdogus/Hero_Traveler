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
import StoryList from '../Containers/ConnectedStoryList'
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
      <View style={[
        styles.tab,
        (selected && !isProfileView) ? styles.tabSelected : null,
        isProfileView ? styles.fullTab : null
      ]}>
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
    user: PropTypes.object,
    location: PropTypes.string,
    error: PropTypes.object,
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

  renderStory = (story, index) => {
    const {
      tabTypes, selectedTab,
      editable, user, location
    } = this.props
    return (
      <ConnectedStoryPreview
        forProfile={true}
        editable={editable && selectedTab !== tabTypes.bookmarks}
        titleStyle={styles.storyTitleStyle}
        subtitleStyle={styles.subtitleStyle}
        key={story.id}
        story={story}
        userId={user.id}
        height={storyPreviewHeight}
        autoPlayVideo
        allowVideoPlay
        renderLocation={location}
        index={index}
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
    return (
      <View>
        {renderProfileInfo()}
        {!!error &&
          <Text style={styles.errorText}>Unable to fully load user data. Please try again.</Text>
        }
      </View>
    )
  }

  hasBadge(){
    const {user} = this.props
    return user.role === 'contributor' || user.role === 'founding member'
  }

  render() {
    const {renderProfileInfo, storiesById, fetchStatus, editable} = this.props
    const isGettingStories = this.isGettingStories()

    return (
      <View style={editable ? styles.profileTabsAndStoriesRoot : styles.profileTabsAndStoriesRootWithMarginForNavbar}>
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
          <StoryList
            style={styles.storyList}
            storiesById={storiesById}
            refreshing={false}
            headerContentHeight={this.hasBadge() ? 225 : 204}
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
