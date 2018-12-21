import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import styles, {storyWidth, storyHeight} from './Styles/GuideStoriesOfTypeStyles'
import {styles as StoryReadingScreenStyles} from '../Containers/Styles/StoryReadingScreenStyles'
import getImageUrl from '../Shared/Lib/getImageUrl'
import ImageWrapper from './ImageWrapper'
import {TouchlessPlayButton} from './VideoPlayer'

const defaultVideoImageOptions = {
  video: true,
  width: storyWidth,
}

const defaultImageOptions = {
  width: storyWidth,
  height: storyHeight,
}

export function getStoryImageUrl(
  story,
  videoImageOptions = defaultVideoImageOptions,
  imageOptions = defaultImageOptions,
) {
    const isVideo = !!story.coverVideo
    return isVideo
      ? getImageUrl(story.coverVideo, 'optimized', videoImageOptions)
      : getImageUrl(story.coverImage, 'optimized', imageOptions)
}

export default class GuideStoriesOfType extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isShowAll: PropTypes.bool,
    stories: PropTypes.arrayOf(PropTypes.object).isRequired,
    authors: PropTypes.object.isRequired,
    onPressAll: PropTypes.func,
    onPressAuthor: PropTypes.func.isRequired,
    isGuide: PropTypes.bool,
  }

  onPressAll = () => {
    this.props.onPressAll(this.props.type)
  }

  onPressStory = (story) => {
    if (this.props.isGuide) return () => {
      NavActions.guide({guideId: story.id, title: story.title})
    }

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
    const coverUrl = getStoryImageUrl(story)
    const {authors} = this.props
    // quick fix to allow story items from algolia search
    const hasAuthorsObj = !!Object.keys(authors).length

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
        <TouchableOpacity onPress={this.onPressAuthor(
          hasAuthorsObj
            ? story.author
            : story.authorId,
        )}>
          <Text style={styles.author}>
            {hasAuthorsObj
              ? authors[story.author].username
              : story.author
            }
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
          {!isShowAll && stories.length > 4 &&
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
