import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, TouchableOpacity} from 'react-native'

import styles from './Styles/StoryReadingToolbarStyles'
import TabIcon from './TabIcon'

export default class StoryReadingToolbarComponent extends Component {
  static propTypes = {
    onPressLike: PropTypes.func,
    onPressComment: PropTypes.func,
    onPressBookmark: PropTypes.func,
    onPressShare: PropTypes.func,
    onPressFlag: PropTypes.func,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    likeCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    commentCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isStory: PropTypes.bool,
  }

  renderInViewOrTouch(contents, style, onPress) {
    if (onPress) return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
      >
        {contents}
      </TouchableOpacity>
    )
    return (
      <View
        style={style}
      >
        {contents}
      </View>
    )
  }

  render() {
    const {
      onPressLike,
      onPressComment,
      onPressBookmark,
      onPressFlag,
      isStory,
      onPressShare,
    } = this.props

    const likeContainer = (
      <View style={styles.wrapper}>
        <Text
          style={styles.text}
        >
          {this.props.likeCount || 0}
        </Text>
        <TabIcon
          name={this.props.isLiked ? 'like-active' : 'like'}
          style={{image: styles.heartIcon}}
        />
      </View>
    )

    const likeComponent = this.renderInViewOrTouch(
      likeContainer,
      styles.likeTool,
      onPressLike,
    )

    const commentContainer = (
      <View style={styles.wrapper}>
        <Text
          style={styles.text}
        >
          {this.props.commentCount || 0}
        </Text>
        <TabIcon name={'comment'}/>
      </View>
    )

    const commentComponent = this.renderInViewOrTouch(
      commentContainer,
      styles.commentTool,
      onPressComment,
    )

    const bookmarkContainer = (
      <View style={styles.wrapper}>
        <TabIcon name={this.props.isBookmarked ? 'bookmark-active' : 'bookmark'}/>
      </View>
    )

    const bookmarkComponent = this.renderInViewOrTouch(
      bookmarkContainer,
      styles.bookmarkTool,
      onPressBookmark,
    )

    const shareContainer = (
      <View style={styles.wrapper}>
        <TabIcon
          name={'share'}
          style={{image: styles.shareIcon}}
        />
      </View>
    )

    const shareComponent = this.renderInViewOrTouch(
      shareContainer,
      styles.shareTool,
      onPressShare,
    )

    const flagContainer = (
      <View style={styles.wrapper}>
        <TabIcon
          name={'flag'}
          style={{image: styles.flagIcon}}
        />
      </View>
    )

    const flagComponent = this.renderInViewOrTouch(
      flagContainer,
      styles.shareTool,
      onPressFlag,
    )

    return (
      <View style={[
        styles.root,
        this.props.style,
        {justifyContent: 'space-around'},
      ]}>
        {likeComponent}
        {commentComponent}
        {isStory && bookmarkComponent}
        {shareComponent}
        {isStory && flagComponent}
      </View>
    )
  }
}
