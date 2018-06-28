import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  Animated,
  RefreshControl
} from 'react-native'

import formatCount from '../Shared/Lib/formatCount'
import ConnectedFeedItemPreview from '../Containers/ConnectedFeedItemPreview'
import {Metrics} from '../Shared/Themes'
import StoryReadingToolbar from './StoryReadingToolbar'
import Loader from './Loader'
import FlagModal from './FlagModal'
import {styles, translations} from '../Containers/Styles/StoryReadingScreenStyles'

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
    flagTargetEntity: PropTypes.func,
    renderBody: PropTypes.func,
    animatedViews: PropTypes.arrayOf(PropTypes.func),
    selectedTab: PropTypes.string,
  }

  static defaultProps = {
    animatedViews: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      showFlagModal: false,
      scrollY: new Animated.Value(0),
    }
  }

  _toggleFlag = () => {
    this.setState({showFlagModal: !this.state.showFlagModal})
  }

  render () {
    const {
      author, user, isLiked, isBookmarked, renderBody, animatedViews,
      onPressLike, onPressBookmark, onPressComment,
      fetching, getTargetEntity, targetEntity, flagTargetEntity,
      selectedTab,
    } = this.props
    const { scrollY } = this.state
    if (!targetEntity || !author) {
      return (
        <View style={[styles.darkRoot]}>
          {!targetEntity &&
            <Loader style={styles.loader} />
          }
          { targetEntity && !!targetEntity.error &&
            <Text>{targetEntity.error}</Text>
          }
        </View>
      )
    }

    const toolbarTranslation = scrollY.interpolate(translations.toolbar)

    return (
      <View style={[styles.root]}>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          style={[styles.scrollView]}
        >
          {!targetEntity.draft &&
          <RefreshControl
            refreshing={fetching || false}
            onRefresh={getTargetEntity}
          />
          }
          <ConnectedFeedItemPreview
            isFeed={false}
            isStory={this.props.isStory}
            onPressLike={this._toggleLike}
            showLike={false}
            key={targetEntity.id}
            height={Metrics.screenHeight}
            feedItem={targetEntity}
            userId={user.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            isReadingScreen={true}
            selectedTab={selectedTab}
          />
          {renderBody()}
        </Animated.ScrollView>
        <Animated.View
          style={[
            styles.toolBar,
            { transform: [{ translateY: toolbarTranslation }] },
          ]}>
          <StoryReadingToolbar
            likeCount={formatCount(targetEntity.counts.likes)}
            commentCount={formatCount(targetEntity.counts.comments)}
            boomarkCount={formatCount(targetEntity.counts.bookmarks)}
            isBookmarked={isBookmarked}
            isLiked={isLiked}
            userId={user.id}
            storyId={targetEntity.id}
            onPressLike={onPressLike}
            onPressFlag={this._toggleFlag}
            onPressBookmark={onPressBookmark}
            onPressComment={onPressComment}
          />
        </Animated.View>
        {animatedViews.map(renderFunc => {
          return (renderFunc(scrollY))
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
