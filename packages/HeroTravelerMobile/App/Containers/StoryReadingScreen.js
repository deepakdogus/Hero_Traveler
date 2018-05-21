import React from 'react'
import PropTypes from 'prop-types'
import {Text, View, Animated, TouchableOpacity, Image, RefreshControl} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import MapView from 'react-native-maps';
import RNDraftJSRender from 'react-native-draftjs-render';
import {compose, withHandlers} from 'recompose'
import _ from 'lodash'

import StoryActions from '../Shared/Redux/Entities/Stories'
import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import formatCount from '../Shared/Lib/formatCount'
import ConnectedStoryPreview from './ConnectedStoryPreview'
import {Metrics, Images} from '../Shared/Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import TabIcon from '../Components/TabIcon'
import ImageWrapper from '../Components/ImageWrapper'
import Loader from '../Components/Loader'
import FlagModal from '../Components/FlagModal'
import {styles, rendererStyles, translations} from './Styles/StoryReadingScreenStyles'
import VideoPlayer from '../Components/VideoPlayer'
import Immutable from 'seamless-immutable'
import {getVideoUrlFromString} from '../Shared/Lib/getVideoUrl'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getRelativeHeight from '../Shared/Lib/getRelativeHeight'
import {displayLocationDetails} from '../Shared/Lib/locationHelpers'
import isTooltipComplete, {Types as TooltipTypes} from '../Shared/Lib/firstTimeTooltips'
import UserActions from '../Shared/Redux/Entities/Users'

const enhanceStoryVideo = compose(
  withHandlers(() => {
    let _ref
    return {
      registerRef: () => ref => {
        _ref = ref
      },
      togglePlay: () => () => {
        _ref.toggle()
      }
    }
  })
)

const StoryVideo = enhanceStoryVideo((props) => {
  const height = props.height || Metrics.screenWidth * 9 / 16
  return (
    <View
      style={[styles.videoWrapper, {height}]}
    >
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
        resizeMode='cover'
      />
    </View>
  )
})

const atomicHandler = (item: Object): any => {
  if (_.get(item, 'data.type')) {
    // if backgroundFailure getRelativeHeight returns NaN so adding failsafe
    const width = Metrics.screenWidth
    const height = Math.min(
      getRelativeHeight(width, item.data),
      Metrics.maxContentHeight
    ) || Metrics.maxContentHeight

    switch (item.data.type) {
      case 'image':
        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <View style={[styles.mediaPlaceholder, {minHeight: height}]}>
            <ImageWrapper
                style={{width, height}}
                cached={true}
                fullWidth={true}
                source={{uri: `${getImageUrl(item.data.url, 'optimized', {
                  width,
                  height,
                })}`}}
              />
            </View>
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        );
      case 'video':
        const url = getVideoUrlFromString(item.data.url, true)
        const downloadUrl = getVideoUrlFromString(item.data.url, false)
        const thumbnailUrl = getImageUrl(item.data.url, 'optimized', {
          video: true,
          width: 'screen',
        })

        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <View style={[styles.mediaPlaceholder, {minHeight: height}]}>
            <StoryVideo path={url} downloadPath={downloadUrl} thumbnailPath={thumbnailUrl} height={height}/>
            </View>
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        )
      default:
        return null;
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
      storyId: props.storyId
    })
  }
})(StoryReadingToolbar)

class StoryReadingScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    storyId: PropTypes.string,
    story: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.object,
  };

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

  _toggleLike = () => {
    this.props.toggleLike(this.props.user.id, this.props.story.id)
  }

  _toggleFlag = () => {
    this.setState({showFlagModal: !this.state.showFlagModal})
  }

  _pressAddToGuide = () => {
     const { story } = this.props
     NavActions.AddStoryToGuides({ story })
  }

  renderCategories = () => {
    let categories = _.compact(this.props.story.categories.map((category) => {
      return category.title
    }))
    return <Text style={[styles.sectionText, styles.sectionTextHighlight]}>{categories.join(', ')}</Text>
  }

  renderHashtags = () => {
    let hashtags = _.compact(this.props.story.hashtags.map((hashtag) => {
      return "#" + hashtag.title
    }))
    return <Text style={[rendererStyles.unstyled, styles.sectionTextHighlight]}>{hashtags.join(', ')}</Text>
  }

  _flagStory = () => {
    this.props.flagStory(this.props.user.id, this.props.story.id)
    NavActions.pop()
  }

  hasLocationInfo() {
    const {locationInfo} = this.props.story
    return (
      !!locationInfo && !!locationInfo.name
      && !!locationInfo.latitude
      && !!locationInfo.longitude
    )
  }

  _getCostType = () => {
    const {type, currency} = this.props.story
    let title = '';
    switch (type) {
      case 'see':
      case 'do':
        break;
      case 'eat':
        title = ' per person'
        break;
      case 'stay':
        title = ' per night'
        break;
      default:
        break;
    }
    // The currency is hardcoded for now, might want to change it later.
    let currencySign = currency || ' USD';
    title = currencySign + title;
    return title;
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

  render () {
    const { story, author, user } = this.props
    const { scrollY } = this.state
    if (!story || !author) {
      return (
        <View style={[styles.darkRoot]}>
          {!story &&
            <Loader style={styles.loader} />
          }
          { story && !!story.error &&
            <Text>{story.error}</Text>
          }
        </View>
      )
    }

    const toolbarTranslation = scrollY.interpolate(translations.toolbar)
    const plusButtonTranslation = scrollY.interpolate(translations.plusButton)
    const tooltipOpacity = scrollY.interpolate(translations.tooltip)

    const showNextTooltip = !!user && !isTooltipComplete(
      TooltipTypes.ADD_TO_GUIDE,
      user.introTooltips,
    )

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
          {!story.draft &&
          <RefreshControl
            refreshing={this.props.fetching || false}
            onRefresh={this.getStory}
          />
          }
          <ConnectedStoryPreview
            isFeed={false}
            onPressLike={this._toggleLike}
            showLike={false}
            gradientColors={['rgba(0,0,0,.65)', 'transparent', 'transparent', 'rgba(0,0,0,.65)']}
            gradientLocations={[0,.25,.5,1]}
            key={story.id}
            height={Metrics.screenHeight}
            story={story}
            userId={user.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            isStoryReadingScreen={true}
          />
          <View style={styles.divider}/>
          <View style={styles.content}>
            {!!story.draftjsContent &&
              <RNDraftJSRender
                contentState={Immutable.asMutable(story.draftjsContent, {deep: true})}
                customStyles={rendererStyles}
                atomicHandler={atomicHandler}
              />
            }
            {!!this.props.story.hashtags &&
              this.renderHashtags()
            }
            {!!story.videoDescription &&
              <View style={styles.videoDescription}>
                <Text style={styles.videoDescriptionText}>{story.videoDescription}</Text>
              </View>
            }
            {this.hasLocationInfo() &&
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
                  <MapView.Marker coordinate={{
                    latitude: story.locationInfo.latitude,
                    longitude: story.locationInfo.longitude
                  }} />
                </MapView>
                <View style={styles.marginedRow}>
                  <View style={styles.iconWrapper}>
                    <TabIcon
                      name='location'
                      style={{ image: styles.icon }}
                    />
                  </View>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={[styles.sectionText, styles.sectionLabel]}>Location:</Text>
                    {story.locationInfo &&
                    <Text style={[styles.sectionText, styles.sectionTextHighlight]}>
                      {displayLocationDetails(story.locationInfo)}
                    </Text>
                    }
                  </View>
                </View>
              </View>
            }
            {!!story.categories.length &&
              <View style={styles.sectionWrapper}>
                <View style={styles.iconWrapper}>
                  <TabIcon
                    name='tag'
                    style={{ image: styles.icon }}
                  />
                </View>
                <View style={styles.sectionTextWrapper}>
                  <Text style={styles.sectionLabel}>Categories: </Text>
                  {this.renderCategories()}
                </View>
              </View>
            }
            {!!story.cost &&
              <View style={styles.sectionWrapper}>
                <View style={styles.iconWrapper}>
                  <TabIcon
                    name='cost'
                    style={{ image: styles.icon }}
                  />
                </View>
                <View style={styles.sectionTextWrapper}>
                  <Text style={styles.sectionLabel}>Cost: </Text>
                  <Text style={styles.sectionText}>{story.cost + this._getCostType()}</Text>
                </View>
              </View>
            }
            {!!story.travelTips &&
              <View style={styles.sectionWrapper}>
                <View style={styles.iconWrapper}>
                  <TabIcon
                    name='travelTips'
                    style={{ image: styles.icon }}
                  />
                </View>
                <View style={styles.sectionTextWrapper}>
                  <Text style={styles.sectionLabel}>Travel Tips: </Text>
                  <Text style={styles.sectionText}>{story.travelTips}</Text>
                </View>
              </View>
            }

          </View>
        </Animated.ScrollView>
        <Animated.View
          style={[
            styles.toolBar,
            { transform: [{ translateY: toolbarTranslation }] },
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
        {/* Plus button tooltip ADD CHECK OT DISABLE TOOLTIP */}
        {showNextTooltip && (
          <TouchableOpacity onPress={this.dismissTooltip}>
            <Animated.View
              style={[
                { opacity: tooltipOpacity },
                styles.addToGuideTooltip,
              ]}>
              <Text style={{ color: 'white' }}>
                {`Tap to add story\nto a travel guide`}
              </Text>
              <View style={styles.addToGuideTooltipArrow} />
            </Animated.View>
          </TouchableOpacity>
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
  const {session: {userId}} = state
  let { fetching, entities: stories, error } = state.entities.stories
  const story = stories[props.storyId]
  return {
    author: story ? state.entities.users.entities[story.author] : undefined,
    user: state.entities.users.entities[userId],
    fetching,
    story,
    error,
    isLiked: isStoryLiked(state.entities.users, userId, props.storyId),
    isBookmarked: isStoryBookmarked(state.entities.users, userId, props.storyId),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLike: (userId, storyId) => dispatch(StoryActions.storyLike(userId, storyId)),
    toggleBookmark: (userId, storyId) => dispatch(StoryActions.storyBookmark(userId, storyId)),
    requestStory: (storyId) => dispatch(StoryActions.storyRequest(storyId)),
    flagStory: (userId, storyId) => dispatch(StoryActions.flagStory(userId, storyId)),
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
