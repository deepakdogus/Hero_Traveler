import React, { PropTypes } from 'react'
import { ScrollView, Text, View, Image } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import MapView from 'react-native-maps';

import StoryActions from '../Redux/Entities/Stories'
import formatCount from '../Lib/formatCount'
import StoryList from '../Components/StoryList'
import StoryPreview from '../Components/StoryPreview'
import RoundedButton from '../Components/RoundedButton'
import {Metrics, Images} from '../Themes'
import StoryReadingToolbar from '../Components/StoryReadingToolbar'
import styles from './Styles/StoryReadingScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

const StoryContent = ({story, style}) => {
  return (
    <View style={[styles.storyContentWrapper, style]}>
      <Text style={styles.storyContentText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut blandit mauris, aliquet ultricies risus. Proin finibus justo sed est malesuada pulvinar. In in leo ligula. Nunc iaculis sodales pellentesque. Cras vel odio arcu. Nulla ultrices nulla mauris. Morbi scelerisque aliquam dignissim. Proin eget sodales nisi, nec hendrerit enim. Fusce auctor nisi dolor. Nam luctus nisl sit amet dui eleifend, iaculis dignissim arcu imperdiet. Praesent urna turpis, suscipit ut malesuada ut, ullamcorper a ante. Nunc id gravida lacus, et aliquet elit.
      </Text>
      <Image source={Images.profile} style={styles.storyContentImage} />
      <Text style={styles.storyContentText}>
        Nulla rhoncus augue varius condimentum rhoncus. Nam pharetra arcu sodales, elementum eros in, vestibulum erat. Maecenas id tellus lorem. Etiam bibendum maximus placerat. Proin consequat consectetur augue aliquam accumsan. Nulla semper nulla in quam congue volutpat sit amet sed velit. Mauris molestie, ex at accumsan lobortis, dui felis posuere mauris, et consectetur purus arcu sit amet lacus. Vivamus at eros lectus.
      </Text>
      <Image source={Images.createStory} style={styles.storyContentImage} />
      <Text style={styles.storyContentText}>
        Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce nec metus non dolor vehicula interdum. Maecenas consequat consectetur purus, sit amet mattis nisi gravida vitae. Mauris in turpis vehicula purus cursus varius. Praesent sit amet lorem id nulla maximus interdum eu aliquet dui.
      </Text>
      <Text style={styles.storyContentText}>
        Maecenas nec augue scelerisque, egestas nisi ut, viverra nisl. Maecenas non sollicitudin ante. Aliquam at efficitur lectus. Nam vulputate orci sed gravida imperdiet. Ut ante ante, ornare ac diam sed, maximus maximus ex. Donec pulvinar, quam sit amet maximus tincidunt, lectus leo pharetra justo, ac porttitor eros sapien quis ante. Aenean lorem nisi, sagittis a odio non, venenatis tincidunt mi. Pellentesque varius turpis auctor dui efficitur, nec vulputate purus luctus.
      </Text>
      <Image source={Images.profile} style={styles.storyContentImage} />
      <Text style={styles.storyContentText}>
        Phasellus fermentum lorem vel magna volutpat tempor. Nulla et ante sed nulla mollis vestibulum nec quis ante. Praesent fermentum ante rutrum fringilla dapibus. In ac mauris faucibus, cursus odio ut, pharetra nisi. Fusce eu arcu dapibus, feugiat diam ac, euismod nulla. Phasellus odio odio, malesuada at augue eget, maximus sagittis nulla. In vitae odio imperdiet, porttitor dui sed, pharetra tortor. Nullam ullamcorper sit amet erat luctus semper. Suspendisse tincidunt ipsum id ligula lacinia, nec varius nunc varius. Etiam tellus nulla, dictum vel eleifend vitae, laoreet eget dui. Donec lobortis eu elit et dictum. Phasellus vestibulum nulla magna, malesuada luctus tortor mattis sed. Pellentesque eleifend non tellus quis sodales. Nunc consequat elit at felis elementum euismod laoreet vitae purus. Aliquam sed neque sed ligula ornare lacinia consequat eu augue.
      </Text>
      <Image source={Images.createStory} style={styles.storyContentImage} />
      <Text style={styles.storyContentText}>
        Nulla efficitur lacinia accumsan. Nulla vulputate hendrerit neque, eget ullamcorper leo accumsan quis. Aenean nec metus sed purus mollis fermentum id vitae risus. Ut nisl metus, aliquam eleifend turpis vel, molestie laoreet erat. Maecenas volutpat sapien at justo suscipit gravida. Vivamus nisl odio, condimentum nec ligula et, semper egestas justo. Morbi ac placerat nibh, et vestibulum nisi.
      </Text>
    </View>
  )
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
    this.props.toggleLike(storyWithUser.id)
  }

  render () {
    let { story, fetching, error } = this.props;
    const storyWithUser = {
      ...story,
      author: this.props.usersById[story.author]
    }

    const baseText = styles.storyContentText

    return (
      <View style={[styles.root]}>
        <ScrollView style={[styles.scrollView]}>
          <StoryPreview
            onPressUser={(userId) => alert(`User ${userId} pressed`)}
            onPressLike={this._toggleLike}
            key={story.id}
            height={Metrics.screenHeight}
            story={storyWithUser}
          />
          <View style={styles.content}>
            {!story.content &&
              <StoryContent
                style={styles.content}
                story={storyWithUser}
              />
            }
            {story.content &&
              <Text style={styles.storyContentText}>{story.content}</Text>
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
            likeCount={formatCount(storyWithUser.counts.likes)}
            commentCount={formatCount(storyWithUser.counts.comments)}
            boomarkCount={formatCount(storyWithUser.counts.bookmarks)}
            isBookmarked={storyWithUser.isBookmarked}
            isLiked={storyWithUser.isLiked}
            onPressLike={() => this._toggleLike}
            onPressBookmark={() => this.props.toggleBookmark(storyWithUser.id)}
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
  let { fetching, entities: stories, error } = state.entities.stories;
  return {
    user: state.session.user,
    usersById: state.entities.users.entities,
    fetching,
    story: stories[props.storyId],
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLike: (storyId) => dispatch(StoryActions.storyLike(storyId)),
    toggleBookmark: (storyId) => dispatch(StoryActions.storyBookmark(storyId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
