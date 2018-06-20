import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import styles, {storyWidth} from './Styles/GuideStoriesOfTypeStyles'
import {styles as StoryReadingScreenStyles} from '../Containers/Styles/StoryReadingScreenStyles'
import getImageUrl from '../Shared/Lib/getImageUrl'
import ImageWrapper from './ImageWrapper'
import {TouchlessPlayButton} from './VideoPlayer'

const videoImageOptions = {
  video: true,
  width: storyWidth
}

export default class GuideStoriesOfType extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isShowAll: PropTypes.bool,
    stories: PropTypes.arrayOf(PropTypes.object).isRequired,
    authors: PropTypes.object.isRequired,
    onPressAll: PropTypes.func.isRequired,
    onPressAuthor: PropTypes.func.isRequired,
  }

  onPressAll = () => {
    this.props.onPressAll(this.props.type)
  }

  onPressStory = (story) => {
    return () => {
      NavActions.story({storyId: story.id, title: story.title})
    }
  }

  onPressAuthor = (authorId) => {
    return () => {
      this.props.onPressAuthor(authorId)
    }
  }

  renderPlayButton = () => {
    return (
      <View style={styles.playButtonAbsolute}>
        <View style={styles.playButtonCenter}>
          <TouchlessPlayButton size={20}/>
        </View>
      </View>
    )
  }

  renderStory = (story) => {
    const isVideo = !!story.coverVideo
    const coverUrl = isVideo
      ? getImageUrl(story.coverVideo, 'optimized', videoImageOptions)
      : getImageUrl(story.coverImage, 'basic')
    const {authors} = this.props

    return (
      <View key={story.id} style={styles.storyView}>
        <TouchableOpacity onPress={this.onPressStory(story)}>
          <ImageWrapper
            cached
            source={{uri: coverUrl}}
            style={styles.image}
          />
         {isVideo && this.renderPlayButton()}
          <Text style={styles.title}>
            {story.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressAuthor(story.author)}>
          <Text style={styles.author}>
            {authors[story.author].username}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    const {label, stories, isShowAll} = this.props

    if (stories.length === 0) return null

    return (
      <Fragment>
        {!isShowAll && <View style={StoryReadingScreenStyles.divider}/>}
        <View style={[
          styles.wrapper,
          isShowAll && styles.wrapperShowAll,
        ]}>
          <Text style={styles.label}>
            {label}
          </Text>
          <View style={styles.storiesWrapper}>
            {stories.map((story, index) => {
              if (!isShowAll && index >= 4) return null
              return this.renderStory(story)
            })}
          </View>
          {!isShowAll &&
            <TouchableOpacity onPress={this.onPressAll}>
              <View style={styles.seeAllView}>
                <Text style={styles.seeAll}>
                  See all ({stories.length})
                </Text>
              </View>
            </TouchableOpacity>
          }
        </View>
      </Fragment>
    )
  }
}
