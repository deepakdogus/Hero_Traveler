import React from 'react'
import PropTypes from 'prop-types'
import {ScrollView, Text, View, Animated, TouchableOpacity} from 'react-native'
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
import Image from '../Components/Image'
import Loader from '../Components/Loader'
import {styles, rendererStyles} from './Styles/StoryReadingScreenStyles'
import Video from '../Components/Video'
import Immutable from 'seamless-immutable'
import {getVideoUrlBase} from '../Shared/Lib/getVideoUrl'
import {getImageUrlBase} from '../Shared/Lib/getImageUrl'
import {CategoryFeedNavActionStyles} from './Styles/ExploreScreenStyles'

const enhanceStoryVideo = compose(
  withHandlers(() => {
    let _ref
    return {
      registerRef: () => ref => {
        _ref = ref
      },
      onPress: () => () => {
        _ref.goFullscreen()
      }
    }
  })
)

const StoryVideo = enhanceStoryVideo((props) => {
  return (
    <View
      style={styles.videoWrapper}
    >
      <Video
        ref={props.registerRef}
        path={props.src}
        style={styles.video}
        allowVideoPlay={true}
        autoPlayVideo={false}
        showMuteButton={false}
        showPlayButton={true}
        playButtonSize={'small'}
        videoFillSpace={true}
      >
        <TouchableOpacity
          style={styles.videoExpand}
          onPress={props.onPress}
        >
          <Icon
            name='expand'
            color='white'
            style={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,.75)'
            }}
            size={20} />
        </TouchableOpacity>
      </Video>
    </View>
  )
})

const atomicHandler = (item: Object): any => {
  if (_.get(item, 'data.type')) {
    switch (item.data.type) {
      case 'image':
        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <Image
              fullWidth={true}
              source={{uri: `${getImageUrlBase()}/${item.data.url}`}}
            />
            {!!item.text && <Text style={styles.caption}>{item.text}</Text>}
          </View>
        );
      case 'video':
        return (
          <View key={item.key} style={styles.mediaViewWrapper}>
            <StoryVideo src={`${getVideoUrlBase()}/${item.data.url}`}/>
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
    error: PropTypes.bool
  };

  constructor(props) {
    super(props)
    this.onScroll = this.onScroll.bind(this)
    this.toolbarShown = false
    this.state = {
      toolbarHeight: new Animated.Value(0),
      newYPos: -1,
      oldYPos: 0,
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

  renderTags = () => {
    return this.props.story.categories.map((category, index) => {
      return (
        <Text key={index} style={styles.tag}>#{category.title} </Text>
      )
    })
  }

  render () {
    const { story, author } = this.props;
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
          { story && story.error &&
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
            onPressLike={this._toggleLike}
            showLike={false}
            showUserInfo={true}
            onPressUser={this._pressUser}
            gradientColors={['rgba(0,0,0,.65)', 'transparent', 'transparent', 'rgba(0,0,0,.65)']}
            gradientLocations={[0,.25,.5,1]}
            key={story.id}
            height={Metrics.screenHeight}
            storyId={story.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            showReadMessage={true}
            isContentVisible={this.isShowContent()}
          />
          <View style={styles.content}>
            {!!story.draftjsContent &&
              <RNDraftJSRender
                contentState={Immutable.asMutable(story.draftjsContent, {deep: true})}
                customStyles={rendererStyles}
                atomicHandler={atomicHandler}
              />
            }
            {!!story.videoDescription &&
              <View style={styles.videoDescription}>
                <Text style={styles.videoDescriptionText}>{story.videoDescription}</Text>
              </View>
            }
            {!!story.categories.length &&
              <View style={[styles.marginedRow, styles.tagRow]}>
                {this.renderTags()}
              </View>
            }
            {!!story.location &&
              <View style={styles.locationWrapper}>
                <MapView
                  style={styles.locationMap}
                  initialRegion={{
                    latitude: story.latitude,
                    longitude: story.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <MapView.Marker coordinate={{
                    latitude: story.latitude,
                    longitude: story.longitude
                  }} />
                </MapView>
                <View style={styles.marginedRow}>
                  <View style={styles.locationIconWrapper}>
                    <TabIcon
                      name='location'
                      style={{ image: styles.locationIcon }}
                    />
                  </View>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={[styles.locationLabel]}>Location:</Text>
                    <Text style={[styles.locationText]}>{story.location}</Text>
                  </View>
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
            toggleBookmark={this.props.toggleBookmark}
          />
        </Animated.View>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
