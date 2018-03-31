import React from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  Text,
  View,
  Image,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import MapView from 'react-native-maps'
import RNDraftJSRender from 'react-native-draftjs-render'
import { compose, withHandlers } from 'recompose'
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'

import StoryActions from '../Shared/Redux/Entities/Stories'
import { isStoryLiked, isStoryBookmarked } from '../Shared/Redux/Entities/Users'
import formatCount from '../Shared/Lib/formatCount'
import ConnectedStoryPreview from './ConnectedStoryPreview'
import { Images, Metrics } from '../Shared/Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import TabIcon from '../Components/TabIcon'
import ImageWrapper from '../Components/ImageWrapper'
import Loader from '../Components/Loader'
import FlagModal from '../Components/FlagModal'
import { styles, rendererStyles } from './Styles/StoryReadingScreenStyles'
import VideoPlayer from '../Components/VideoPlayer'
import Immutable from 'seamless-immutable'
import { getVideoUrlBase } from '../Shared/Lib/getVideoUrl'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getRelativeHeight from '../Shared/Lib/getRelativeHeight'
import { displayLocationDetails } from '../Shared/Lib/locationHelpers'

const enhanceStoryVideo = compose(
  withHandlers(() => {
    let _ref
    return {
      registerRef: () => ref => {
        _ref = ref
      },
      togglePlay: () => () => {
        _ref.toggle()
      },
    }
  })
)

const StoryVideo = enhanceStoryVideo(props => {
  const height = props.height || Metrics.screenWidth * 9 / 16
  return (
    <View style={[styles.videoWrapper, { height }]}>
      <VideoPlayer
        ref={props.registerRef}
        path={props.src}
        style={styles.video}
        allowVideoPlay={true}
        autoPlayVideo={false}
        showMuteButton={false}
        showPlayButton={false}
        videoFillSpace={true}
        resizeMode='cover'
      />
    </View>
  )
})

const atomicHandler = (item: Object): any => {
  if (_.get(item, 'data.type')) {
    // if backgroundFailure getRelativeHeight returns NaN so adding failsafe
    const height =
      Math.min(
        getRelativeHeight(Metrics.screenWidth, item.data),
        Metrics.maxContentHeight
      ) || Metrics.maxContentHeight

    switch (item.data.type) {
      case 'image':
        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <ImageWrapper
              fullWidth={true}
              source={{
                uri: `${getImageUrl(item.data.url, 'optimized', {
                  width: Metrics.screenWidth,
                  height,
                })}`,
              }}
            />
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        )
      case 'video':
        const url = item.data.url
        let videoUrl =
          item.data.HLSUrl || `${getVideoUrlBase()}/${item.data.url}`
        if (
          typeof url === 'string' &&
          (url.substring(0, 7) === 'file://' ||
            url.substring(0, 6) === '/Users')
        ) {
          videoUrl = url
        }
        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <StoryVideo src={videoUrl} height={height} />
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        )
      default:
        return null
    }
  }

  return null
}

const EnhancedStoryReadingToolbar = withHandlers({
  onPressBookmark: props => () => {
    props.toggleBookmark(props.userId, props.storyId)
  },
  onPressComment: props => () => {
    NavActions.storyComments({
      storyId: props.storyId,
    })
  },
})(StoryReadingToolbar)

class StoryReadingScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    storyId: PropTypes.string,
    story: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.object,
  }

  state = {
    showFlagModal: false,
    scrollY: new Animated.Value(0),
  }

  constructor(props) {
    super(props)
    if (!this.props.story) {
      this.props.requestStory(this.props.storyId)
    }
  }

  _toggleLike = () => {
    this.props.toggleLike(this.props.user.id, this.props.story.id)
  }

  _toggleFlag = () => {
    this.setState({ showFlagModal: !this.state.showFlagModal })
  }

  _pressUser = userId => {
    if (this.props.user.id === userId) {
      NavActions.profile({ type: 'jump' })
    } else {
      NavActions.readOnlyProfile({ userId })
    }
  }

  _pressAddToGuide = () => {
    const { story } = this.props
    NavActions.addStoryToGuide({
      story,
    })
  }

  /* MBT 08/08/17: Hold off on clickable tags until future notice
  // _navBackToStory = () => {
  //   NavActions.story({storyId: this.props.story.id})
  // }

  // _onPressTag = (category) => {
  //   NavActions.explore_categoryFeed({
  //     categoryId: category.id,
  //     title: category.title,
  //     leftButtonIconStyle: CategoryFeedNavActionStyles.leftButtonIconStyle,
  //     navigationBarStyle: CategoryFeedNavActionStyles.navigationBarStyle,
  //     onLeft: this._navBackToStory
  //   })
  // }
    <TouchableOpacity
      key={index}
      onPress={() => this._onPressTag(category)}
    >
    </TouchableOpacity>
  */

  renderTags = () => {
    const lastIndex = this.props.story.categories.length - 1
    return this.props.story.categories.map((category, index) => {
      return (
        <Text key={index} style={styles.tag}>
          {category.title}
          {index !== lastIndex ? ', ' : ''}
        </Text>
      )
    })
  }

  _flagStory = () => {
    this.props.flagStory(this.props.user.id, this.props.story.id)
    NavActions.pop()
  }

  hasLocationInfo() {
    const { locationInfo } = this.props.story
    return (
      !!locationInfo &&
      !!locationInfo.name &&
      !!locationInfo.latitude &&
      !!locationInfo.longitude
    )
  }

  render() {
    const { scrollY } = this.state
    const { story, author, user } = this.props
    if (!story || !author) {
      return (
        <View style={[styles.darkRoot]}>
          {!story && (
            <Loader
              style={{
                flex: 1,
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
          )}
          {story && !!story.error && <Text>{story.error}</Text>}
        </View>
      )
    }

    const scrollOffset = 20
    const toolbarTranslation = scrollY.interpolate({
      inputRange: [
        scrollOffset - 1,
        scrollOffset,
        Metrics.tabBarHeight + scrollOffset,
        Metrics.tabBarHeight + scrollOffset + 1,
      ],
      outputRange: [Metrics.tabBarHeight, Metrics.tabBarHeight, 0, 0],
    })
    const plusButtonY = Metrics.tabBarHeight + Metrics.baseMargin
    const plusButtonTranslation = scrollY.interpolate({
      inputRange: [
        scrollOffset - 1,
        scrollOffset,
        plusButtonY + scrollOffset,
        plusButtonY + scrollOffset + 1,
      ],
      outputRange: [
        plusButtonY + Metrics.tabBarHeight,
        plusButtonY + Metrics.tabBarHeight,
        0,
        0,
      ],
    })
    let tooltipOpacity
    /**
     * TODO: Integrate to refer to device token or the likes
     */
    const showTooltip = true
    if (showTooltip) {
      tooltipOpacity = scrollY.interpolate({
        inputRange: [
          plusButtonY + scrollOffset - 1,
          plusButtonY + scrollOffset,
          plusButtonY + scrollOffset + 1,
        ],
        outputRange: [0, 1, 1],
      })
    }

    return (
      <View style={[styles.root]}>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          style={[styles.scrollView]}>
          <ConnectedStoryPreview
            isFeed={false}
            onPressLike={this._toggleLike}
            showLike={false}
            onPressUser={this._pressUser}
            gradientColors={[
              'rgba(0,0,0,.65)',
              'transparent',
              'transparent',
              'rgba(0,0,0,.65)',
            ]}
            gradientLocations={[0, 0.25, 0.5, 1]}
            key={story.id}
            height={Metrics.screenHeight}
            story={story}
            userId={user.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            isStoryReadingScreen={true}
          />
          <View style={styles.divider} />
          <View style={styles.content}>
            {!!story.draftjsContent && (
              <RNDraftJSRender
                contentState={Immutable.asMutable(story.draftjsContent, {
                  deep: true,
                })}
                customStyles={rendererStyles}
                atomicHandler={atomicHandler}
              />
            )}
            {!!story.videoDescription && (
              <View style={styles.videoDescription}>
                <Text style={styles.videoDescriptionText}>
                  {story.videoDescription}
                </Text>
              </View>
            )}
            {!!story.categories.length && (
              <View style={[styles.marginedRow, styles.tagRow]}>
                <Text style={styles.tagLabel}>Categories: </Text>
                {this.renderTags()}
              </View>
            )}
            {this.hasLocationInfo() && (
              <View style={styles.locationWrapper}>
                <MapView
                  style={styles.locationMap}
                  initialRegion={{
                    latitude: story.locationInfo.latitude,
                    longitude: story.locationInfo.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
                  <MapView.Marker
                    coordinate={{
                      latitude: story.locationInfo.latitude,
                      longitude: story.locationInfo.longitude,
                    }}
                  />
                </MapView>
                <View style={styles.marginedRow}>
                  <View style={styles.locationIconWrapper}>
                    <TabIcon
                      name="location"
                      style={{ image: styles.locationIcon }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}>
                    <Text style={[styles.locationText, styles.locationLabel]}>
                      Location:
                    </Text>
                    <Text style={styles.locationText}>
                      {story.locationInfo.name}
                    </Text>
                    <Text style={[styles.locationText, styles.locationDetails]}>
                      {displayLocationDetails(story.locationInfo)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </Animated.ScrollView>
        <Animated.View
          style={[
            styles.toolBar,
            {
              transform: [{ translateY: toolbarTranslation }],
            },
          ]}>
          <EnhancedStoryReadingToolbar
            likeCount={formatCount(story.counts.likes)}
            commentCount={formatCount(story.counts.comments)}
            boomarkCount={formatCount(story.counts.bookmarks)}
            isBookmarked={this.props.isBookmarked}
            isLiked={this.props.isLiked}
            userId={this.props.user.id}
            storyId={story.id}
            onPressLike={this._toggleLike}
            onPressFlag={this._toggleFlag}
            toggleBookmark={this.props.toggleBookmark}
          />
        </Animated.View>
        {/* Plus button for adding to Guide */}
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateY: plusButtonTranslation,
                },
              ],
            },
            styles.plusButton,
          ]}>
          <TouchableOpacity
            onPress={this._pressAddToGuide}
            style={styles.plusButtonTouchable}>
            <Image
              source={Images.iconContentPlusWhite}
              style={styles.plusButtonIcon}
            />
          </TouchableOpacity>
        </Animated.View>
        {/* Plus button tooltip */}
        {showTooltip && (
          <Animated.View
            style={[
              {
                opacity: tooltipOpacity,
              },
              styles.addToGuideTooltip,
            ]}>
            <Text style={{ color: 'white' }}>
              {`Tap to add story\nto a travel guide`}
            </Text>
            <View style={styles.addToGuideTooltipArrow} />
          </Animated.View>
        )}
        {
          <FlagModal
            closeModal={this._toggleFlag}
            showModal={this.state.showFlagModal}
            flagStory={this._flagStory}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { session: { userId } } = state
  let { fetching, entities: stories, error } = state.entities.stories
  const story = stories[props.storyId]
  return {
    author: story ? state.entities.users.entities[story.author] : undefined,
    user: state.entities.users.entities[userId],
    fetching,
    story,
    error,
    isLiked: isStoryLiked(state.entities.users, userId, props.storyId),
    isBookmarked: isStoryBookmarked(
      state.entities.users,
      userId,
      props.storyId
    ),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleLike: (userId, storyId) =>
      dispatch(StoryActions.storyLike(userId, storyId)),
    toggleBookmark: (userId, storyId) =>
      dispatch(StoryActions.storyBookmark(userId, storyId)),
    requestStory: storyId => dispatch(StoryActions.storyRequest(storyId)),
    flagStory: (userId, storyId) =>
      dispatch(StoryActions.flagStory(userId, storyId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
