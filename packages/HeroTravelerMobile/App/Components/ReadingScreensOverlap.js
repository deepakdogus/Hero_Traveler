import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, Animated, RefreshControl } from 'react-native'

import formatCount from '../Shared/Lib/formatCount'
import ConnectedFeedItemPreview from '../Containers/ConnectedFeedItemPreview'
import { Metrics } from '../Shared/Themes'
import StoryReadingToolbar from './StoryReadingToolbar'
import Loader from './Loader'
import FlagModal from './FlagModal'
import {
  styles,
  translations,
} from '../Containers/Styles/StoryReadingScreenStyles'
import _ from 'lodash'

class ReadingScreenOverlap extends React.Component {
  static propTypes = {
    author: PropTypes.object,
    user: PropTypes.object,
    targetEntity: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.object,
    getTargetEntity: PropTypes.func,
    isBookmarked: PropTypes.bool,
    isLiked: PropTypes.bool,
    onPressLike: PropTypes.func,
    onPressFlag: PropTypes.func,
    onPressBookmark: PropTypes.func,
    onPressComment: PropTypes.func,
    onPressShare: PropTypes.func,
    flagTargetEntity: PropTypes.func,
    renderBody: PropTypes.func,
    animatedViews: PropTypes.arrayOf(PropTypes.func),
    selectedTab: PropTypes.string,
    isStory: PropTypes.bool,
    hideDescription: PropTypes.bool,
  }

  static defaultProps = {
    animatedViews: [],
    hideDescription: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      showFlagModal: false,
      scrollY: new Animated.Value(0),
    }
  }

  _toggleFlag = () => {
    this.setState({ showFlagModal: !this.state.showFlagModal })
  }

  render() {
    const {
      author,
      user,
      isLiked,
      isBookmarked,
      renderBody,
      animatedViews,
      onPressLike,
      onPressBookmark,
      onPressComment,
      onPressShare,
      fetching,
      getTargetEntity,
      targetEntity,
      flagTargetEntity,
      selectedTab,
      isStory,
      hideDescription,
    } = this.props
    const { scrollY } = this.state
    if (!targetEntity || !author) {
      return (
        <View style={[styles.root, styles.centered]}>
          {!targetEntity && <Loader style={styles.loader} />}
          {targetEntity && !!targetEntity.error && (
            <Text style={styles.text}>{targetEntity.error}</Text>
          )}
        </View>
      )
    }

    const toolbarTranslation = scrollY.interpolate(translations.toolbar)

    // FOR TEMPORARY BUILDS ONLY -- REMOVE AFTER `feature/editor-upgrades` PR merged
    let editingDisabled = false
    if (isStory && targetEntity) {
      // check for block level entries that can't be created in app yet
      const blocks = _.get(targetEntity, 'draftjsContent.blocks')
      const blockTypes = (blocks && blocks.map(block => block.type)) || []
      const prohibitedValues = ['unordered-list-item', 'blockquote', 'divider']
      editingDisabled = blockTypes.some(type => prohibitedValues.includes(type))

      // ensure there are no links
      const entityMap = _.get(targetEntity, 'draftjsContent.entityMap')
      const entityTypes
        = (entityMap && Object.keys(entityMap).map(key => entityMap[key].type))
        || []
      if (!editingDisabled) editingDisabled = entityTypes.includes('LINK')
    }

    return (
      <View style={[styles.root]}>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          style={[styles.scrollView]}
        >
          {!targetEntity.draft && (
            <RefreshControl
              refreshing={fetching || false}
              onRefresh={getTargetEntity}
            />
          )}
          <ConnectedFeedItemPreview
            isFeed={false}
            isStory={isStory}
            hideDescription={hideDescription}
            onPressLike={this._toggleLike}
            showLike={false}
            key={targetEntity.id}
            height={Metrics.screenHeight}
            feedItem={targetEntity}
            userId={user.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            isReadingScreen={true}
            // FOR TEMPORARY BUILDS ONLY -- REMOVE AFTER `feature/editor-upgrades` PR merged
            editingDisabled={editingDisabled}
            openModal={this.openModal}
            selectedTab={selectedTab}
          />
          {renderBody()}
          {<View style={styles.toolbarPadding} />}
        </Animated.ScrollView>
        <Animated.View
          style={[
            styles.toolBar,
            { transform: [{ translateY: toolbarTranslation }] },
          ]}
        >
          <StoryReadingToolbar
            isStory={isStory}
            likeCount={formatCount(targetEntity.counts.likes)}
            commentCount={formatCount(targetEntity.counts.comments)}
            isBookmarked={isBookmarked}
            isLiked={isLiked}
            userId={user.id}
            storyId={targetEntity.id}
            onPressLike={onPressLike}
            onPressFlag={this._toggleFlag}
            onPressBookmark={onPressBookmark}
            onPressComment={onPressComment}
            onPressShare={onPressShare}
          />
        </Animated.View>
        {animatedViews.map(renderFunc => {
          return renderFunc(scrollY)
        })}
        {/* Plus button for adding to Guide */}
        {
          <FlagModal
            closeModal={this._toggleFlag}
            showModal={this.state.showFlagModal}
            flagStory={flagTargetEntity}
          />
        }
      </View>
    )
  }
}

export default ReadingScreenOverlap
