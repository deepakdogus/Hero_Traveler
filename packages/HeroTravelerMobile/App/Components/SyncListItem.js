import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native'
import Immutable from 'seamless-immutable'

import { Colors, Metrics } from '../Shared/Themes/'
import VideoPlayer from './VideoPlayer'
import getImageUrl from '../Shared/Lib/getImageUrl'
import getVideoUrl from '../Shared/Lib/getVideoUrl'
export const ActivityProps = {
  story: PropTypes.object.isRequired,
  failedMethod: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  publishLocalDraft: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
}

export default class Activity extends Component {
  static propTypes = ActivityProps

  isRetrying(){
    return this.props.status === 'retrying'
  }

  renderCover() {
    const {coverImage, coverVideo} = this.props.story
    let cover = coverImage || coverVideo
    let coverUrl = coverImage ? getImageUrl(cover, 'basic') : getVideoUrl(cover)

    if (coverImage){
      return (
        <Image
          cached={false}
          resizeMode='cover'
          source={{uri: coverUrl}}
          style={[styles.coverStyle, styles.coverWrapper]}
        />
      )
    }
    else return (
      <View style={[styles.coverStyle, styles.coverWrapper]}>
        <VideoPlayer
          path={coverUrl}
          allowVideoPlay={false}
          autoPlayVideo={false}
          showPlayButton={false}
          resizeMode='cover'
          videoStyle={styles.coverStyle}
        />
      </View>
    )
  }

  render () {
    let {
      story,
      error,
    } = this.props

    return (
      <View style={styles.root}>
        <TouchableOpacity
          onPress={this._onPress}
        >
          <View style={styles.innerButton}>
            {this.renderCover()}
            <View style={styles.middle}>
              <Text style={styles.description}>
                <Text style={styles.title}>{story.title}</Text>
                <Text> {error}</Text>
              </Text>
            </View>
            <View style={styles.end}>
              {this.isRetrying() &&
                <ActivityIndicator size='small' color={Colors.background}/>
              }
              {!this.isRetrying() && <Text style={styles.retry}>RETRY</Text>}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _onPress = () => {
    const {story, failedMethod} = this.props
    this.props[failedMethod](Immutable.asMutable(story, {deep: true}))
  }
}

const coverSize = 40
const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderBottomColor: '#bdbdbd',
    borderBottomWidth: 1,
  },
  innerButton: {
    flexDirection: "row",
    paddingVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
  },
  middle: {
    marginLeft: Metrics.baseMargin,
    justifyContent: 'center',
    width: Metrics.screenWidth - coverSize * 1.5 - Metrics.doubleBaseMargin * 2 - 50,
  },
  end: {
    marginLeft: 5,
    justifyContent: 'center',
  },
  retry: {
    fontSize: 14,
    color: Colors.background,
    fontWeight: '300',
    letterSpacing: 0.7,
  },
  description: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: '300',
    letterSpacing: 0.7,
  },
  coverWrapper: {
    marginHorizontal: Metrics.baseMargin
  },
  title: {
    fontWeight: '600',
    color: Colors.background,
  },
  coverStyle: {
    width: coverSize,
    height: coverSize,
    borderRadius: coverSize/2,
  }
})
