import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import styles, {feedItemWidth, feedItemHeight} from './Styles/FeedItemsOfTypeStyles'
import {styles as StoryReadingScreenStyles} from '../Containers/Styles/StoryReadingScreenStyles'
import getImageUrl from '../Shared/Lib/getImageUrl'
import ImageWrapper from './ImageWrapper'
import {TouchlessPlayButton} from './VideoPlayer'
import TabIcon from './TabIcon'

const defaultVideoImageOptions = {
  video: true,
  width: feedItemWidth,
}

const defaultImageOptions = {
  width: feedItemWidth,
  height: feedItemHeight,
}

export function getFeedItemImageURL(
  feedItem,
  videoImageOptions = defaultVideoImageOptions,
  imageOptions = defaultImageOptions,
) {
    const isVideo = !!feedItem.coverVideo
    return isVideo
      ? getImageUrl(feedItem.coverVideo, 'optimized', videoImageOptions)
      : getImageUrl(feedItem.coverImage, 'optimized', imageOptions)
}

export default class FeedItemsOfType extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isShowAll: PropTypes.bool,
    feedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    authors: PropTypes.object.isRequired,
    onPressAll: PropTypes.func,
    onPressAuthor: PropTypes.func.isRequired,
    isGuide: PropTypes.bool,
  }

  onPressAll = () => {
    this.props.onPressAll(this.props.type)
  }

  onPressFeedItem = feedItem => {
    if (this.props.isGuide) return () => {
      NavActions.guide({guideId: feedItem.id, title: feedItem.title})
    }

    return () => {
      NavActions.story({storyId: feedItem.id, title: feedItem.title})
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

  renderFeedItem = feedItem => {
    const isVideo = !!feedItem.coverVideo
    const coverUrl = getFeedItemImageURL(feedItem)
    const { authors, isGuide } = this.props
    // quick fix to allow feedItems from algolia search
    const hasAuthorsObj = !!Object.keys(authors).length

    return (
      <View key={feedItem.id} style={styles.feedItemView}>
        <TouchableOpacity onPress={this.onPressFeedItem(feedItem)}>
          <ImageWrapper
            cached
            source={{uri: coverUrl}}
            style={styles.image}
          />
         {isVideo && this.renderPlayButton()}
          <View style={styles.titleContainer}>
            {isGuide && (
              <TabIcon name='guide' style={{
                  view: styles.guideIcon,
                  image: styles.guideIconImage,
                }}
              />
            )}
              <Text style={styles.title}>
                {feedItem.title}
              </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressAuthor(
          hasAuthorsObj
            ? feedItem.author
            : feedItem.authorId,
        )}>
          <Text style={styles.author}>
            {hasAuthorsObj
              ? authors[feedItem.author].username
              : feedItem.author
            }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    const {label, feedItems, isShowAll} = this.props

    if (feedItems.length === 0) return null

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
          <View style={styles.feedItemsWrapper}>
            {feedItems.map((feedItem, index) => {
              if (!isShowAll && index >= 4) return null
              return this.renderFeedItem(feedItem)
            })}
          </View>
          {!isShowAll && feedItems.length > 4 &&
            <TouchableOpacity onPress={this.onPressAll}>
              <View style={styles.seeAllView}>
                <Text style={styles.seeAll}>
                  See all ({feedItems.length})
                </Text>
              </View>
            </TouchableOpacity>
          }
        </View>
      </Fragment>
    )
  }
}
