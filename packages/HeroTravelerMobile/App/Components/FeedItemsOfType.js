import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'

import styles, {feedItemWidth, feedItemHeight} from './Styles/FeedItemsOfTypeStyles'
import {styles as StoryReadingScreenStyles} from '../Containers/Styles/StoryReadingScreenStyles'
import getImageUrl from '../Shared/Lib/getImageUrl'
import FeedItemThumbnail from './FeedItemThumbnail'

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

export default class FeedItemsOfType extends Component {
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

  render () {
    const {
      label,
      feedItems,
      isShowAll,
      authors,
      onPressAuthor,
      isGuide,
    } = this.props

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

              const isVideo = !!feedItem.coverVideo
              const coverUrl = getFeedItemImageURL(feedItem)

              // db and algolia use differently named properties for author id
              const hasAuthorsObj = authors && !!Object.keys(authors).length
              const authorId = hasAuthorsObj
                ? feedItem.author
                : feedItem.authorId
              const username = hasAuthorsObj
                ? authors[feedItem.author].username
                : feedItem.author

              return (
                <FeedItemThumbnail
                  key={feedItem.id}
                  feedItem={feedItem}
                  coverUrl={coverUrl}
                  isVideo={isVideo}
                  isGuide={isGuide}
                  authorId={authorId}
                  username={username}
                  onPressAuthor={onPressAuthor}
                />
              )
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
