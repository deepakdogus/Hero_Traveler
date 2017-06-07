import React, { PropTypes } from 'react'
import { ScrollView, Text, View, Image, StyleSheet, Animated } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import MapView from 'react-native-maps';
import HTMLView from 'react-native-htmlview'

import StoryActions from '../Redux/Entities/Stories'
import {isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import formatCount from '../Lib/formatCount'
import ConnectedStoryPreview from './ConnectedStoryPreview'
import {Metrics, Fonts, Colors} from '../Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import TabIcon from '../Components/TabIcon'
import {styles, HTMLViewStyles} from './Styles/StoryReadingScreenStyles'

function isCaption(node) {
  return node.attribs && node.attribs.class === 'caption'
}

/*
  - the first half of conditional statement captures initial text that is not wrapped in a div
  - the second half of conditional captures normal divs
*/
function isText(node) {
  return node.type === 'text' && !node.parent||
  node.type === 'tag' && node.name === 'div' && !node.attribs.class
}

// - to properly apply styling we need to isolate the various elements we use
function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name === 'img') {
    const img = node.attribs
    // dynamic marginBottom for when we do not have a caption
    const marginBottom = (siblings[index+1] && isCaption(siblings[index+1])) ? 0 : 60
    return (
      <Image
        key={index}
        source={{uri: img.src}}
        resizeMode='cover'
        style={[HTMLViewStyles.img, {marginBottom: marginBottom}]}
      />
    )
  }

  // captures normal text
  if (isText(node)) {
    const text = node.type === 'text' ? node.data : node.children[0].data
    return (<Text
      key={index}
      style={HTMLViewStyles.text}
    >
      {text}
    </Text>)
  }

  // captures h1 and styles appropriately
  if (node.type === 'tag' && node.name === 'h1') {
    return (
      <Text
        key={index}
        style={HTMLViewStyles.header}
      >
        {node.children[0].data}
      </Text>)
  }

  // ensuring caption has bottom margin
  if (node.type === 'tag' && node.name === 'div' && node.attribs.class === 'caption') {
    return (
      <Text
        key={index}
        style={[HTMLViewStyles.text, HTMLViewStyles.caption]}
      >
        node.children[0].data}
      </Text>
    )
  }
}

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
      toolbarHeight: new Animated.Value(0)
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
            onPressUser={(userId) => {
              if (this.props.user.id === userId) {
                NavActions.profile({type: 'jump'})
              } else {
                NavActions.readOnlyProfile({userId})
              }
            }}
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
                <HTMLView
                  style={{
                    flex: 1,
                    paddingTop: 60
                  }}
                  value={story.content}
                  renderNode={renderNode}
                />
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
          <StoryReadingToolbar
            likeCount={formatCount(story.counts.likes)}
            commentCount={formatCount(story.counts.comments)}
            boomarkCount={formatCount(story.counts.bookmarks)}
            isBookmarked={this.props.isBookmarked}
            isLiked={this.props.isLiked}
            onPressLike={() => this._toggleLike()}
            onPressBookmark={() => this.props.toggleBookmark(this.props.user.id, story.id)}
            onPressComment={() => NavActions.storyComments({
              storyId: story.id
            })}
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
