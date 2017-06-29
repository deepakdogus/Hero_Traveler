import React from 'react'
import PropTypes from 'prop-types'
import {ScrollView, Text, View, Animated, TouchableOpacity, StyleSheet, Image as RNImage} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import MapView from 'react-native-maps';
import RNDraftJSRender from 'react-native-draftjs-render';
import {compose, toClass, withHandlers} from 'recompose'
import _ from 'lodash'

import StoryActions from '../Redux/Entities/Stories'
import {isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import formatCount from '../Lib/formatCount'
import ConnectedStoryPreview from './ConnectedStoryPreview'
import {Metrics, Fonts, Colors} from '../Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import TabIcon from '../Components/TabIcon'
import Image from '../Components/Image'
import {styles} from './Styles/StoryReadingScreenStyles'
// import Video from '../Components/Video'

const contentState = {
  "blocks": [
    {
      "entityRanges": [],
      "depth": 0,
      "data": {},
      "inlineStyleRanges": [],
      "text": "Maecenas nec odio",
      "type": "header-one",
      "key": "ad9sdfdg5"
    },
    {
      "key": "5r867",
      "text": "Etiam ultricies nisi vel augue. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Cras dapibus. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 25,
          "length": 5,
          "style": "BOLD"
        },
        {
          "offset": 307,
          "length": 10,
          "style": "BOLD"
        },
        {
          "offset": 241,
          "length": 6,
          "style": "ITALIC"
        }
      ],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "5r864123",
      "text": "Etiam ultricies nisi vel augue.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 5,
          "key": 0
        }
      ],
      "data": {}
    },
    {
      "key": "5r8641253",
      "text": "Etiam ultricies nisi vel augue.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 0,
          "length": 5,
          "style": "BOLD"
        }
      ],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "5r8641",
      "text": "Etiam ultricies nisi vel augue.",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 7,
          "length": 9,
          "style": "BOLD"
        },
        {
          "offset": 7,
          "length": 10,
          "style": "ITALIC"
        }
      ],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "5r8641",
      "text": "This is an awesome caption for an image",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],      
      "data": {
        "type": "image",
        "url": "https://lorempixel.com/400/200/"
      }
    },
  ],
  "entityMap": {
    "0": {
      "type": "LINK",
      "mutability": "MUTABLE",
      "data": {
        "url": "https://github.com/globocom/react-native-draftjs-render"
      }
    }
  }
}


const customStyles = StyleSheet.flatten({
  unstyled: {
    fontSize: 18,
    fontWeight: '300',
    fontFamily: Fonts.type.base,
    color: Colors.grey,
    letterSpacing: .7,
    paddingHorizontal: 25,
  },
  'header-one': {
    fontSize: Fonts.size.h5,
    fontWeight: '400',
    fontFamily: Fonts.type.base,
    color: Colors.background,
    letterSpacing: .7,
    paddingHorizontal: 25,
  },
});

const atomicHandler = (item: Object): any => {
  switch (item.data.type) {
    case 'image':
      // getting the metrics for the image
      // if (!this.state.media[item.key])
      // RNImage.getSize(item.data.url, (width, height) => {
      //   const mediaCopy = _.cloneDeep(this.state.media)
      //   mediaCopy[item.key] = {
      //     width,
      //     height,
      //   }
      //   this.setState({
      //     media: mediaCopy
      //   })
      // })

      // // converting metrics to right scale
      // const imageMetrics = this.state.media[item.key]
      // if (!imageMetrics) return null
      // const resizedHeight = Metrics.screenWidth / imageMetrics.width * imageMetrics.height
      // console.log("resizedHeight is", resizedHeight)
      return (
        <View key={item.key} style={{ flex: 1, marginBottom: 60 }}>
          <Image
            style={{
              width: Metrics.screenWidth,
              height: 200,
            }}
            source={{ uri: item.data.url }}
          />
          <Text style={{
            textAlign: 'center',
            fontStyle: 'italic',
            fontWeight: '300',
            letterSpacing: .7,
            fontSize: 15,
            fontFamily: Fonts.type.base,
          }}>{item.text}</Text>
        </View>
      );
    default:
      return null;
  }
};

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
      media: {},
    }
  }

  onScroll(event) {
    const ypos = event.nativeEvent.contentOffset.y
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

  render () {
    const { story } = this.props;
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
            titleStyle={{fontWeight: '700'}}
            gradientColors={['rgba(0,0,0,.75)', 'transparent', 'rgba(0,0,0,.75)']}
            key={story.id}
            height={Metrics.screenHeight}
            storyId={story.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
            showReadMessage={true}
          />
          <View style={{flex: 1, marginBottom: Metrics.tabBarHeight}}>
            {!!story.content &&
              <View style={{
                flex: 1,
                paddingVertical: Metrics.baseMargin,
                marginBottom: Metrics.navBarHeight,
              }}>
                <RNDraftJSRender
                  contentState={contentState}
                  customStyles={customStyles}
                  atomicHandler={atomicHandler}
                />
              </View>
            }
            {!!story.videoDescription &&
              <View style={styles.videoDescription}>
                <Text style={styles.videoDescriptionText}>{story.videoDescription}</Text>
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
                <View style={{
                  flexDirection: 'row',
                  marginHorizontal: Metrics.section
                }}>
                  <View style={styles.locationIcon}>
                    <TabIcon name='location'/>
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
    toggleBookmark: (userId, storyId) => dispatch(StoryActions.storyBookmark(userId, storyId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
