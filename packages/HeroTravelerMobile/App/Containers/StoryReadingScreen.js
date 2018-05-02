import React from 'react'
import PropTypes from 'prop-types'
import {ScrollView, Text, View, Animated, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import MapView from 'react-native-maps';
import RNDraftJSRender from 'react-native-draftjs-render';
import {compose, withHandlers} from 'recompose'
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'

import StoryActions from '../Shared/Redux/Entities/Stories'
import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import formatCount from '../Shared/Lib/formatCount'
import ConnectedStoryPreview from './ConnectedStoryPreview'
import {Metrics} from '../Shared/Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import TabIcon from '../Components/TabIcon'
import ImageWrapper from '../Components/ImageWrapper'
import Loader from '../Components/Loader'
import FlagModal from '../Components/FlagModal'
import {styles, rendererStyles} from './Styles/StoryReadingScreenStyles'
import VideoPlayer from '../Components/VideoPlayer'
import Immutable from 'seamless-immutable'
import {getVideoUrlFromString} from '../Shared/Lib/getVideoUrl'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getRelativeHeight from '../Shared/Lib/getRelativeHeight'
import {displayLocationDetails} from '../Shared/Lib/locationHelpers'

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
    const height = Math.min(
      getRelativeHeight(Metrics.screenWidth, item.data),
      Metrics.maxContentHeight
    ) || Metrics.maxContentHeight

    switch (item.data.type) {
      case 'image':
        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <View style={[styles.mediaPlaceholder, {minHeight: height}]}>
              <ImageWrapper
                cached={true}
                fullWidth={true}
                source={{uri: `${getImageUrl(item.data.url, 'optimized', {
                  width: Metrics.screenWidth,
                  height
                })}`}}
              />
            </View>
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        );
      case 'video':
        const url = getVideoUrlFromString(item.data.url, true)
        const downloadUrl = getVideoUrlFromString(item.data.url, false)
        const thumbnailUrl = getImageUrl(url, 'optimized', {
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
    this.onScroll = this.onScroll.bind(this)
    this.toolbarShown = false
    this.state = {
      toolbarHeight: new Animated.Value(0),
      newYPos: -1,
      oldYPos: 0,
      showFlagModal: false,
    }
    if (!this.props.story) {
      this.props.requestStory(this.props.storyId)
    }
  }

  onScroll(event) {
    const ypos = event.nativeEvent.contentOffset.y
    this.setState({
      oldYPos: this.state.newYPos,
      newYPos: ypos,
    })
    if (ypos > 35 && !this.toolbarShown) {
      this.toolbarShown = true
      this.showToolbar()
    } else if (ypos <= 35 && this.toolbarShown) {
      this.toolbarShown = false
      this.hideToolbar()
    }

  }

  showToolbar() {
    Animated.timing(
      this.state.toolbarHeight,
      {
        toValue: Metrics.tabBarHeight,
        duration: 200,
      },
    ).start()
  }

  hideToolbar() {
    Animated.timing(
      this.state.toolbarHeight,
      {
        toValue: 0,
        duration: 200,
      },
    ).start()
  }

  _toggleLike = () => {
    this.props.toggleLike(this.props.user.id, this.props.story.id)
  }

  _toggleFlag = () => {
    this.setState({showFlagModal: !this.state.showFlagModal})
  }

  _pressUser = (userId) => {
    if (this.props.user.id === userId) {
      NavActions.profile({type: 'jump'})
    } else {
      NavActions.readOnlyProfile({userId})
    }
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
  /*
  If the old YPos is superior the the new YPos it means we scrolled up
  and should show the content. Otherwise we should hide it.
  */
  isShowContent() {
    return this.state.oldYPos >  this.state.newYPos || this.state.newYPos <= 0
  }

  renderCategories = () => {
    let categories = this.props.story.categories.map((category) => {
      return category.title;
    })
    return <Text style={[styles.sectionText, styles.sectionTextHighlight]}>{categories.join(', ')}</Text>
  }

  renderHashtags = () => {
    let hashtags = this.props.story.hashtags.map((hashtag) => {
      return "#" + hashtag.title;
    })
    return <Text style={[rendererStyles.unstyled, styles.sectionTextHighlight]}>{hashtags.join(', ')}</Text>
  }

  _flagStory = () => {
    this.props.flagStory(this.props.user.id, this.props.story.id)
    NavActions.pop()
  }

  hasLocationInfo() {
    const {locationInfo} = this.props.story
    return !!locationInfo && !!locationInfo.name && !!locationInfo.latitude && !!locationInfo.longitude
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

  render () {
    const { story, author, user } = this.props;
    if (!story || !author) {
      return (
        <View style={[styles.darkRoot]}>
          {!story &&
            <Loader style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              }}
            />
          }
          { story && !!story.error &&
            <Text>{story.error}</Text>
          }
        </View>
      )
    }

    return (
      <View style={[styles.root]}>
        <ScrollView
          onScroll={this.onScroll}
          scrollEventThrottle={400}
          style={[styles.scrollView]}>
          <ConnectedStoryPreview
            isFeed={false}
            onPressLike={this._toggleLike}
            showLike={false}
            onPressUser={this._pressUser}
            gradientColors={['rgba(0,0,0,.65)', 'transparent', 'transparent', 'rgba(0,0,0,.65)']}
            gradientLocations={[0,.25,.5,1]}
            key={story.id}
            height={Metrics.screenHeight}
            story={story}
            userId={user.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            isStoryReadingScreen={true}
            isContentVisible={this.isShowContent()}
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
        </ScrollView>
        <Animated.View style={[styles.toolBar, {height: this.state.toolbarHeight}]}>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
