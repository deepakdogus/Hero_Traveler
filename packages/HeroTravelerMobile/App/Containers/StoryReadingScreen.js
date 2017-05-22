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
import {Metrics} from '../Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import styles from './Styles/StoryReadingScreenStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

const htmlStyles = StyleSheet.create({
  img: {
    width: '100%'
  }
})

function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name === 'img') {
    const img = node.attribs
    return (
      <Image source={{uri: img.src}} resizeMode='cover'
        key={index} style={{
          width: Metrics.screenWidth - 10,
          height: Metrics.screenHeight,
          marginLeft: -10,
        }}
      />
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
    if (ypos > 25 && !this.toolbarShown) {
      this.toolbarShown = true
      this.showToolbar()
    } else if (ypos <= 25 && this.toolbarShown) {
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
    const baseText = styles.storyContentText
    return (
      <View style={[styles.root]}>
        <ScrollView
          onScroll={this.onScroll}
          scrollEventThrottle={400}
          style={[styles.scrollView]}>
          <ConnectedStoryPreview
            onPressLike={this._toggleLike}
            onPressUser={(userId) => {
              if (this.props.user.id === userId) {
                NavActions.profile({type: 'jump'})
              } else {
                NavActions.readOnlyProfile({userId})
              }
            }}
            key={story.id}
            height={Metrics.screenHeight}
            storyId={story.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
          />
          <View style={{flex: 1, marginBottom: Metrics.tabBarHeight}}>
            {!!story.content &&
              <View style={{
                flex: 1,
                padding: Metrics.baseMargin,
                marginBottom: Metrics.navBarHeight
              }}>
                <HTMLView
                  style={{
                    flex: 1
                  }}
                  stylesheet={StyleSheet.create({
                    body: {
                      width: Metrics.screenWidth
                    },
                    img: {
                      width: '100px',
                      maxHeight: '100px'
                    }
                  })}
                  value={story.content}
                  renderNode={renderNode}
                />
              </View>
            }
            {story.location &&
              <View style={styles.locationWrapper}>
                <MapView
                  style={styles.locationMap}
                  initialRegion={{
                    latitude: story.latitude,
                    longitude: story.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
                <View style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  marginHorizontal: Metrics.section
                }}>
                  <View style={styles.locationIcon}>
                    <Icon name='map-marker' color='#757575' size={25} />
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
