import React, { PropTypes } from 'react'
import { ScrollView, Text, View, Image, StyleSheet, WebView } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import MapView from 'react-native-maps';
import HTMLView from 'react-native-htmlview'

import StoryActions from '../Redux/Entities/Stories'
import {isStoryLiked, isStoryBookmarked} from '../Redux/Entities/Users'
import formatCount from '../Lib/formatCount'
import StoryList from '../Components/StoryList'
import ConnectedStoryPreview from './ConnectedStoryPreview'
import RoundedButton from '../Components/RoundedButton'
import {Metrics, Images} from '../Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import styles from './Styles/StoryReadingScreenStyles'

const htmlStyles = StyleSheet.create({
  img: {
    width: '100%'
  }
})

function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name === 'img') {
    const img = node.attribs
    console.log('node', node)
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

  _wrapElt(elt){
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>
        {elt}
      </View>
    )
  }

  _showLoader(){
   return (
     <Text style={styles.message}>Loading</Text>
   )
  }

  _showError(){
    return (
      <Text style={styles.message}>Error</Text>
    )
  }

  _showNoStories(){
    return (
      <Text style={styles.title}>There are no stories here</Text>
    )
  }

  _toggleLike = () => {
    this.props.toggleLike(this.props.user.id, this.props.story.id)
  }

  render () {
    const { story, fetching, error, user } = this.props;
    const baseText = styles.storyContentText
    return (
      <View style={[styles.root]}>
        <ScrollView style={[styles.scrollView]}>
          <ConnectedStoryPreview
            onPressLike={this._toggleLike}
            onPressUser={(userId) => NavActions.readOnlyProfile({ userId })}
            key={story.id}
            height={Metrics.screenHeight}
            storyId={story.id}
            autoPlayVideo={true}
            allowVideoPlay={true}
          />
          <View style={{flex: 1}}>
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
                  style={{flex: 1, height: 200}}
                  initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
                <Text style={[baseText, styles.locationText]}>Location: {story.location}</Text>
              </View>
            }
          </View>

          <StoryReadingToolbar
            style={styles.toolBar}
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
        </ScrollView>
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
    // author: state.entities.users.entities[story.author],
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
