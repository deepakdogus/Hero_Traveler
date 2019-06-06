import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Text, View, Animated, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import MapView from 'react-native-maps'
import RNDraftJSRender from 'react-native-draftjs-render'
import { compose, withHandlers } from 'recompose'
import _ from 'lodash'

import StoryActions from '../Shared/Redux/Entities/Stories'
import { isStoryLiked, isStoryBookmarked } from '../Shared/Redux/Entities/Users'
import { Metrics, Images } from '../Shared/Themes'
import ImageWrapper from '../Components/ImageWrapper'
import {
  styles,
  rendererStyles,
  translations,
} from './Styles/StoryReadingScreenStyles'
import VideoPlayer from '../Components/VideoPlayer'
import ReadingScreensOverlap from '../Components/ReadingScreensOverlap'
import ReadingDetails from '../Components/ReadingDetails'
import Immutable from 'seamless-immutable'
import { getVideoUrlFromString } from '../Shared/Lib/getVideoUrl'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getRelativeHeight from '../Shared/Lib/getRelativeHeight'
import isTooltipComplete, {
  Types as TooltipTypes,
} from '../Shared/Lib/firstTimeTooltips'
import UserActions from '../Shared/Redux/Entities/Users'
import { createShareDialog } from '../Lib/sharingMobile'
import StoryActionButton from '../Components/StoryActionButton'

const LINK_ROLES = ['admin', 'brand', 'founding Member']

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
  }),
)

const StoryVideo = enhanceStoryVideo(props => {
  const height = props.height || (Metrics.screenWidth * 9) / 16
  return (
    <View style={[styles.videoWrapper, { height }]}>
      <VideoPlayer
        ref={props.registerRef}
        path={props.path}
        originalPath={props.downloadPath}
        imgUrl={props.thumbnailPath}
        style={styles.video}
        allowVideoPlay={true}
        autoPlayVideo={false}
        showMuteButton={false}
        showPlayButton={false}
        videoFillSpace={true}
        resizeMode="cover"
      />
    </View>
  )
})

const atomicHandler = (item: Object): any => {
  if (_.get(item, 'data.type')) {
    // if pendingDraft getRelativeHeight returns NaN so adding failsafe
    const width = Metrics.screenWidth
    const height
      = Math.min(getRelativeHeight(width, item.data), Metrics.maxContentHeight)
      || Metrics.maxContentHeight

    /* eslint-disable no-case-declarations */
    switch (item.data.type) {
      case 'image':
        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <View style={[styles.mediaPlaceholder, { minHeight: height }]}>
              <ImageWrapper
                style={{ width, height }}
                cached={true}
                fullWidth={true}
                source={{
                  uri: `${getImageUrl(item.data.url, 'optimized', {
                    width,
                    height,
                  })}`,
                }}
              />
            </View>
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        )
      case 'video':
        const url = getVideoUrlFromString(item.data.url, true)
        const downloadUrl = getVideoUrlFromString(item.data.url, false)
        const thumbnailUrl = getImageUrl(item.data.url, 'optimized', {
          video: true,
          width: 'screen',
        })

        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <View style={[styles.mediaPlaceholder, { minHeight: height }]}>
              <StoryVideo
                path={url}
                downloadPath={downloadUrl}
                thumbnailPath={thumbnailUrl}
                height={height}
              />
            </View>
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        )
      default:
        return null
    }
    /* eslint-enable no-case-declarations */
  }

  return null
}

class StoryReadingScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    author: PropTypes.object,
    storyId: PropTypes.string,
    story: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.object,
    onPressBookmark: PropTypes.func,
    onPressRemoveBookmark: PropTypes.func,
    isBookmarked: PropTypes.bool,
    onPressStoryLike: PropTypes.func,
    onPressStoryUnlike: PropTypes.func,
    isLiked: PropTypes.bool,
    flagStory: PropTypes.func,
    completeTooltip: PropTypes.func,
    requestStory: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      showFlagModal: false,
      scrollY: new Animated.Value(0),
    }
    if (!this.props.story) {
      this.getStory()
    }
  }

  _onPressBookmark = () => {
    const {
      onPressRemoveBookmark,
      onPressBookmark,
      isBookmarked,
      storyId,
    } = this.props
    if (isBookmarked) return onPressRemoveBookmark(storyId)
    return onPressBookmark(storyId)
  }

  _onPressComment = () => {
    NavActions.comments({
      storyId: this.props.storyId,
    })
  }

  _toggleLike = () => {
    const {
      story,
      user,
      isLiked,
      onPressStoryLike,
      onPressStoryUnlike,
    } = this.props
    if (isLiked) onPressStoryUnlike(story.id, user.id)
    else onPressStoryLike(story.id, user.id)
  }

  _toggleFlag = () => {
    this.setState({ showFlagModal: !this.state.showFlagModal })
  }

  _pressAddToGuide = () => {
    const { story } = this.props
    NavActions.AddStoryToGuides({
      storyId: story.id,
      story,
    })
  }

  _onPressShare = () => {
    createShareDialog(this.props.story, 'story')
  }

  renderHashtags = () => {
    let hashtags = _.compact(
      this.props.story.hashtags.map(hashtag => {
        return '#' + hashtag.title
      }),
    )
    return (
      <Text style={[rendererStyles.unstyled, styles.sectionTextHighlight]}>
        {hashtags.join(', ')}
      </Text>
    )
  }

  _flagStory = () => {
    this.props.flagStory(this.props.user.id, this.props.story.id)
    NavActions.pop()
  }

  hasLocationInfo() {
    const { locationInfo } = this.props.story
    return (
      !!locationInfo
      && !!locationInfo.name
      && !!locationInfo.latitude
      && !!locationInfo.longitude
    )
  }

  dismissTooltip = () => {
    const updatedTooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.ADD_TO_GUIDE,
      seen: true,
    })
    this.props.completeTooltip(updatedTooltips)
  }

  getStory = () => {
    this.props.requestStory(this.props.storyId)
  }

  stripLinks = draftjsContent => {
    const entityMap = draftjsContent ? draftjsContent.entityMap : null
    if (draftjsContent && entityMap) {
      Object.keys(draftjsContent.blocks).forEach(key => {
        const block = draftjsContent.blocks[key]
        if (block.entityRanges) {
          block.entityRanges = block.entityRanges.filter(
            entityRange => !entityMap[entityRange.key] === 'LINK',
          )
        }
      })
    }
    return draftjsContent
  }

  renderBody = () => {
    const { story, author } = this.props
    const draftjsContent = Immutable.asMutable(story.draftjsContent, {deep: true})
    const isPrivilegedAuthor = author
      && (LINK_ROLES.includes(author.role) || author.isChannel)

    return (
      <Fragment>
        <View style={styles.divider} />
        <View style={styles.content}>
          {!!story.draftjsContent && (
            <RNDraftJSRender
              contentState={isPrivilegedAuthor
                ? draftjsContent
                : this.stripLinks(draftjsContent)
              }
              customStyles={rendererStyles}
              atomicHandler={atomicHandler}
            />
          )}
          {!!this.props.story.hashtags && this.renderHashtags()}
          {!!story.videoDescription && (
            <View style={styles.videoDescription}>
              <Text style={styles.videoDescriptionText}>
                {story.videoDescription}
              </Text>
            </View>
          )}
          {story.actionButton
            && !!story.actionButton.link
            && !!story.actionButton.type && (
              <StoryActionButton
                link={story.actionButton.link}
                type={story.actionButton.type}
              />
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
                }}
              >
                <MapView.Marker
                  coordinate={{
                    latitude: story.locationInfo.latitude,
                    longitude: story.locationInfo.longitude,
                  }}
                />
              </MapView>
            </View>
          )}
          <ReadingDetails targetEntity={story} />
        </View>
      </Fragment>
    )
  }

  renderPlusButton = scrollY => {
    const plusButtonTranslation = scrollY.interpolate(translations.plusButton)
    return (
      <Animated.View
        key="plusButton"
        style={[
          {
            transform: [
              {
                translateY: plusButtonTranslation,
              },
            ],
          },
          styles.plusButton,
        ]}
      >
        <TouchableOpacity
          onPress={this._pressAddToGuide}
          style={styles.plusButtonTouchable}
        >
          <Image
            source={Images.iconContentPlusWhite}
            style={styles.plusButtonIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  renderToolTip = scrollY => {
    const { user } = this.props
    const tooltipOpacity = scrollY.interpolate(translations.tooltip)
    const showNextTooltip
      = !!user
      && !isTooltipComplete(TooltipTypes.ADD_TO_GUIDE, user.introTooltips)
    if (!showNextTooltip) return null

    return (
      <TouchableOpacity key={'tooltip'} onPress={this.dismissTooltip}>
        <Animated.View
          style={[{ opacity: tooltipOpacity }, styles.addToGuideTooltip]}
        >
          <Text style={{ color: 'white' }}>
            {`Tap to add story\nto a travel guide`}
          </Text>
          <View style={styles.addToGuideTooltipArrow} />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      story,
      author,
      user,
      fetching,
      error,
      isBookmarked,
      isLiked,
    } = this.props

    return (
      <ReadingScreensOverlap
        author={author}
        user={user}
        targetEntity={story}
        getTargetEntity={this.getStory}
        fetching={fetching}
        error={error}
        isBookmarked={isBookmarked}
        isLiked={isLiked}
        isStory
        onPressLike={this._toggleLike}
        onPressBookmark={this._onPressBookmark}
        onPressComment={this._onPressComment}
        onPressShare={this._onPressShare}
        flagTargetEntity={this._flagStory}
        renderBody={this.renderBody}
        animatedViews={[this.renderPlusButton, this.renderToolTip]}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  const {
    session: { userId },
  } = state
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
      props.storyId,
    ),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onPressStoryLike: (story, sessionUserId) => {
      dispatch(StoryActions.likeStoryRequest(story, sessionUserId))
    },
    onPressStoryUnlike: (story, sessionUserId) => {
      dispatch(StoryActions.unlikeStoryRequest(story, sessionUserId))
    },
    onPressBookmark: feedItemId =>
      dispatch(StoryActions.bookmarkStoryRequest(feedItemId)),
    onPressRemoveBookmark: feedItemId =>
      dispatch(StoryActions.removeStoryBookmarkRequest(feedItemId)),
    requestStory: storyId => dispatch(StoryActions.storyRequest(storyId)),
    flagStory: (userId, storyId) =>
      dispatch(StoryActions.flagStory(userId, storyId)),
    completeTooltip: introTooltips =>
      dispatch(UserActions.updateUser({ introTooltips })),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoryReadingScreen)
